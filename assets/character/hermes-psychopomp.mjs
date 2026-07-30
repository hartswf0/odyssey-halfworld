/* character.hermes-psychopomp — Hermes Kyllenios, the escorter of souls.
   CHARACTER asset. Scene function (OD-B24-S01): the divine guide who opens
   Book 24 — he "summoned the souls of the suitors" with the golden wand
   "with which he charms the eyes of men asleep and wakes the sleepers", and
   then herds a confused, gibbering mass of new shades down the Ocean stream,
   past the White Rock and the sun gates, to the asphodel meadow.

   This is a HERMES GUISE, held bit-for-bit to the base-Hermes identity so the
   god stays one body across the poem: same youthful skin, same dark tousled
   hair, beardless, short chiton + traveller's chlamys, bare legs + sandals,
   same lithe 0.97 build, same broad-brimmed petasos, same winged talaria at
   both ankles. What changes is the INSTRUMENT and the JOB:

     · the caduceus (twin snakes, herald's staff) is put away, and in its place
       he carries the RHABDOS — the plain golden wand of Book 24, a bright
       banded rod with a charm-star at the tip. Snakeless: this is the soul-
       driving wand, not the messenger's herald staff.
     · the body works as a drover's body: the wand hand raises the rod as the
       marshalling signal, the free hand is thrown open low and BEHIND him in
       a gathering "come on, this way" sweep, and the head is turned back over
       that shoulder to keep the flock in sight while the feet already lead.
     · two diagram marks state the two halves of the job with no baked-in
       figures: a PULL pulse at the open palm (collect) and a DRIVE radiance
       at the wand tip (orient + move). Both are thin broken ink arcs, so they
       stay legible under the dot pass and cost the frame almost no ink.

   No shades are drawn here — the confused mass is `ensemble.suitors-shades`,
   cast beside him. This module is the guide only, fully articulated: face,
   gaze, mouth, hands, shoulders, elbows, hips, knees and feet all stay on the
   shared rig, and identity holds across front / three-quarter / profile / back. */
import { makeFigure, HERO_POSES, INK } from "../../engine/halfworld-engine.mjs";

/* ---- bespoke psychopomp poses (additive; shared registry) ----
   Convention across all three: the RIGHT hand grips the wand (armR stays low
   and close to the body so the rod reads as a clean near-vertical diagonal and
   never leaves the frame); the LEFT arm does the herding work. */

// THE CARD — gathering the new dead: the wand lifted at his right side, the
// left arm flung out low and back with an open palm, head turned over that
// shoulder to count the flock, chin level, brows barely lifted, eyes steady
// and a touch narrowed, lips just parted on the summoning call. Feet already
// leading away: he is walking and looking back at once.
HERO_POSES.hp_gather = { id:"hp_gather", label:"gathering the shades", group:"psychopomp",
  n:{ bodyYaw:-.16, spineLean:.06, chestOpen:.25,
      headYaw:-.52, neckYaw:-.28, headRoll:-.05, gazeX:-.5, gazeY:.04,
      browUp:.12, browKnit:.14, eyeNarrow:.14, jaw:.22, smile:.06,
      armRUpper:-.36, armRLower:.14, handRotR:-.12,      // wand hand low at his right
      armLUpper:.78,  armLLower:-.30, handRotL:-.30, shoulderLiftL:.16,
      hipL:.20, kneeL:.10, hipR:-.16, kneeR:.16, ankleR:.06,
      rootScale:.99 },
  opt:{ hands:["open_palm","fist"] } };

// THE SUMMONS — the wand thrown up as the marshalling signal and the free hand
// raised open beside it; chin lifted, jaw wide on the call, brows up, eyes
// wide. The beat where the souls are called out of the hall and start moving.
HERO_POSES.hp_summon = { id:"hp_summon", label:"summoning the souls", group:"psychopomp",
  n:{ bodyYaw:-.08, spineLean:-.10, chestOpen:.6,
      headYaw:-.18, headPitch:-.20, neckPitch:-.10, gazeX:-.18, gazeY:-.22,
      browUp:.55, browKnit:.10, eyeWide:.3, jaw:.58,
      armRUpper:-.52, armRLower:.10, handRotR:-.2,       // wand hand lifted a little
      armLUpper:2.62, armLLower:-.34, shoulderLiftL:.62, // raised UP, not flung out
                                                         // (a flatter reach runs the palm
                                                         //  into the card border)
      hipL:.04, hipR:-.04,
      rootScale:1.01 },
  opt:{ hands:["open_palm","fist"] } };

// THE ROAD — leading them on: a walking stride, the wand carried low and
// forward as the pointer, the free hand hanging quiet, gaze thrown ahead down
// the crossing. Mouth shut. The long haul between thresholds.
HERO_POSES.hp_lead = { id:"hp_lead", label:"leading the crossing", group:"psychopomp",
  n:{ bodyYaw:-.10, spineLean:-.14,
      headYaw:-.10, headPitch:-.04, gazeX:-.22, gazeY:-.06,
      browUp:.06, browKnit:.22, eyeNarrow:.2, jaw:0,
      armRUpper:-.30, armRLower:.20,
      armLUpper:.22, armLLower:-.18,
      walkSpeed:1, rootScale:.98 },
  opt:{ hands:["relaxed","fist"], action:"walk", loop:true } };

const params = {
  skin:"#d7c3a4", hairColor:"#2a2016",        // base-Hermes skin + dark tousled hair
  hair:"short", beard:false, glasses:false,   // beardless young god
  garment:"tunic", cloak:true, bareLegs:true, // short chiton, chlamys, bare legs + sandals
  scale:0.97,                                 // lithe, quick build (matches base Hermes)
};

const fig = makeFigure(params);

/* ---- palette (solid grays + hard contour; the engine's POST pass supplies
   the halftone, so nothing is pre-dithered here). Everything is kept LIGHT
   except the contour: gold prints bright (few dots), felt prints mid. ---- */
const CAP_FELT   = "#63635b";   // petasos crown — mid felt, distinct from hair
const CAP_BRIM   = "#4c4c44";   // brim underside, a touch deeper
const WING_PALE  = "#dcd7cd";   // talaria feathers — pale against skin/ink
const WAND_GOLD  = "#c6c0a6";   // rhabdos body — bright metal, reads gold
const WAND_LIT   = "#e8e3d2";   // lit sliver up one side of the rod
const WAND_KNOB  = "#a9a48d";   // finial + collar, one step down

/* one feathered wing, anchored at (ax,ay), splaying toward `dir` (+1/-1),
   spanning `len`. Same geometry as base Hermes so the talaria stay identical
   across the god's guises. */
function wing(ctx, ax, ay, dir, len){
  ctx.save();
  ctx.translate(ax, ay);
  ctx.scale(dir, 1);
  ctx.fillStyle = WING_PALE; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(len*0.55, -len*0.60, len*1.06, -len*0.44);
  ctx.quadraticCurveTo(len*0.80, -len*0.12, len*0.64, -len*0.18);
  ctx.quadraticCurveTo(len*0.52, -len*0.02, len*0.42, -len*0.07);
  ctx.quadraticCurveTo(len*0.31,  len*0.07, len*0.22,  0.0);
  ctx.quadraticCurveTo(len*0.11,  len*0.06, 0, 0);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.lineCap = "round";
  for (const sx of [0.20, 0.34, 0.50]){
    ctx.beginPath();
    ctx.moveTo(len*0.06, len*0.02);
    ctx.quadraticCurveTo(len*sx*0.7, -len*sx*0.10, len*sx, -len*sx*0.34);
    ctx.stroke();
  }
  ctx.restore();
}

/* the petasos — broad brim + low crown, identical to base Hermes. */
function petasos(ctx, sx, sy, rot, R){
  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate(rot);
  ctx.fillStyle = CAP_BRIM; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.ellipse(0, -R*0.44, R*1.62, R*0.34, 0, 0, Math.PI*2);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = CAP_FELT;
  ctx.beginPath();
  ctx.moveTo(-R*0.86, -R*0.44);
  ctx.quadraticCurveTo(-R*0.72, -R*1.28, 0, -R*1.30);
  ctx.quadraticCurveTo( R*0.72, -R*1.28, R*0.86, -R*0.44);
  ctx.quadraticCurveTo( R*0.44, -R*0.66, 0, -R*0.66);
  ctx.quadraticCurveTo(-R*0.44, -R*0.66, -R*0.86, -R*0.44);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(-R*1.4, -R*0.40);
  ctx.quadraticCurveTo(0, -R*0.24, R*1.4, -R*0.40); ctx.stroke();
  ctx.restore();
}

/* THE RHABDOS — the golden wand of Book 24. A bright banded rod gripped at
   (hx,hy) and tilted `tilt` radians off vertical (positive = tip toward screen
   right), with a collar, a knob finial and a charm-star at the tip. Drawn as a
   long thin diagonal so it never lays a horizontal bar across the frame. */
function rhabdos(ctx, hx, hy, R, tilt, len){
  const dx = Math.sin(tilt), dy = -Math.cos(tilt);      // up-and-over
  const bx = hx - dx*R*0.62, by = hy - dy*R*0.62;       // butt below the grip
  const tx = hx + dx*len,    ty = hy + dy*len;          // tip
  const px = -dy, py = dx;                              // perpendicular
  const w  = R*0.17;

  ctx.lineCap = "round"; ctx.lineJoin = "round";
  // hard contour, then a BRIGHT core so the rod prints gold (sparse dots)
  ctx.strokeStyle = INK;      ctx.lineWidth = w*2 + 6;
  ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(tx,ty); ctx.stroke();
  ctx.strokeStyle = WAND_GOLD; ctx.lineWidth = w*2;
  ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(tx,ty); ctx.stroke();
  ctx.strokeStyle = WAND_LIT;  ctx.lineWidth = w*0.72;
  ctx.beginPath(); ctx.moveTo(bx - px*w*0.5, by - py*w*0.5);
  ctx.lineTo(tx - px*w*0.5, ty - py*w*0.5); ctx.stroke();

  // three short bands up the shaft (broken, never a full crossing bar)
  ctx.strokeStyle = INK; ctx.lineWidth = 3;
  for (const f of [0.30, 0.52, 0.74]){
    const cx = bx + (tx-bx)*f, cy = by + (ty-by)*f;
    ctx.beginPath();
    ctx.moveTo(cx - px*w*0.9, cy - py*w*0.9);
    ctx.lineTo(cx + px*w*0.9, cy + py*w*0.9);
    ctx.stroke();
  }
  // grip collar at the hand
  ctx.fillStyle = WAND_KNOB; ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(hx, hy, w*1.35, w*0.72, tilt, 0, Math.PI*2);
  ctx.fill(); ctx.stroke();
  // the charm-star that puts the sleepers under and wakes them: four long thin
  // spokes around a SMALL bright knob, so the tip reads as a star, not a blot
  ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.lineCap = "round";
  for (let i=0;i<4;i++){
    const a = tilt + i*Math.PI/4;
    const ux = Math.sin(a), uy = -Math.cos(a);
    const l = (i%2) ? R*0.34 : R*0.52;
    ctx.beginPath();
    ctx.moveTo(tx - ux*l, ty - uy*l);
    ctx.lineTo(tx + ux*l, ty + uy*l);
    ctx.stroke();
  }
  ctx.fillStyle = WAND_LIT; ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(tx, ty, R*0.13, 0, Math.PI*2); ctx.fill(); ctx.stroke();
}

/* a diagram pulse: three broken concentric arcs opening toward `dir`
   (+1 = right, -1 = left). Used twice — a PULL at the open gathering palm
   (collect) and a DRIVE at the wand tip (orient + move). Thin ink only.
   The outer radius is clamped against the frame edges so the mark can never
   be sliced by the card border: an arc that would not fit is drawn smaller,
   and one with no room at all is dropped rather than cropped. */
function pulse(ctx, cx, cy, R, dir, scale, W, H){
  const M = Math.max(14, W*0.035);                       // keep clear of the border
  const room = Math.min(dir > 0 ? (W - M - cx) : (cx - M),
                        cy - M, H - M - cy);
  const outer = Math.min(R*1.22*scale, room);
  if (outer < R*0.34) return;                            // no room — draw nothing
  const k = outer / (R*1.22);
  ctx.strokeStyle = INK; ctx.lineCap = "round";
  const a0 = dir > 0 ? -Math.PI*0.36 : Math.PI*0.64;
  const a1 = dir > 0 ?  Math.PI*0.36 : Math.PI*1.36;
  let i = 0;
  for (const r of [0.52, 0.86, 1.22]){
    ctx.lineWidth = 2.8 - i*0.5;
    const inset = i*0.06;
    ctx.beginPath();
    ctx.arc(cx, cy, R*r*k, a0 + inset, a1 - inset);
    ctx.stroke();
    i++;
  }
}

export const asset = {
  id:"character.hermes-psychopomp",
  type:"CHARACTER",
  name:"Hermes psychopomp",
  statusWord:"SHEPHERDING",
  scene:"OD-B24-S01",

  params,
  layers:["shadow","hair-back","legs","sandal-wings","torso","cloak","far-arm",
          "neck","head","face","hair-front","petasos","near-arm",
          "rhabdos","pull-pulse","drive-pulse"],
  // normalized 0..1 anchors for scene attachment / gaze / the wand / the flock
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.10}, eyes:{x:.50,y:.20},
    rightHand:{x:.63,y:.62}, leftHand:{x:.24,y:.72},
    wandGrip:{x:.63,y:.62}, wandTip:{x:.78,y:.28},
    gatherPalm:{x:.24,y:.72}, flockLead:{x:.14,y:.80},
    hip:{x:.50,y:.66}, leftSandal:{x:.42,y:.92}, rightSandal:{x:.58,y:.92},
    feet:{x:.50,y:.94},
  },
  states:{
    initial:"gathering",
    nodes:{
      // OD-B24-S01 · COLLECT — the flock is behind him and he is counting it
      // over his shoulder, palm open and low, wand up at his side.
      gathering: { preview:{ pose:"hp_gather", t:0.5, wand:true, field:true,
                             status:"SHEPHERDING" } },
      // OD-B24-S01 · CALL — the wand thrown up, mouth wide on the summons.
      summoning: { preview:{ pose:"hp_summon", t:0.5, wand:true, field:true,
                             wandTilt:.10, wandLen:3.9, status:"SUMMONING" } },
      // OD-B24-S01 · ORIENT — the wand levelled as the pointer down the road.
      orienting: { preview:{ pose:"hp_gather", t:0.5, wand:true, field:true,
                             wandTilt:.62, wandLen:3.1, gazeX:-.1,
                             status:"ORIENTING" } },
      // OD-B24-S01 · MOVE — the long crossing, striding, wand carried low.
      leading:   { preview:{ pose:"hp_lead", t:0.35, wand:true, field:false,
                             wandTilt:.20, status:"LEADING" } },
      // stable identity turns (wand stowed on the back view)
      profile:   { preview:{ pose:"profile_left", gaze:{x:-.3,y:0}, mouth:.05,
                             wand:true, field:false, t:0.5 } },
      back:      { preview:{ pose:"back_view", wand:false, field:false, t:0.5 } },
    },
    edges:[
      ["gathering","summoning"],["summoning","gathering"],
      ["gathering","orienting"],["orienting","leading"],["leading","gathering"],
      ["leading","orienting"],["gathering","profile"],["leading","back"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band","wand","wandTilt","wandLen","field",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym","blink"],

  // SIGNATURE — SHEPHERDING. The drover's beat: the golden rhabdos lifted on a
  // long clean diagonal at his right, the free hand thrown open low and back
  // with the PULL pulse at the palm, the DRIVE radiance at the wand tip, head
  // turned over the gathering shoulder with a steady narrowed gaze and lips
  // just parted on the call — while the feet already lead away down the road.
  preview:()=>({ pose:"hp_gather", t:0.5, wand:true, field:true,
                 status:"SHEPHERDING", progress:.2 }),

  draw(ctx, W, H, state={}){
    if (state && state.band) fig.spec.band = state.band;
    // 1) the rig does the body — no hand overpaint on face or limbs
    const out = fig.draw(ctx, W, H, state);
    const rig = fig.hero.rig, d = rig.dim, R = d.headR;

    const turnedAway = (state.pose==="back_view" || state.band==="back");

    // 2) winged sandals (talaria) at both ankles — the god's own speed
    const aL = rig.ankL.point(), aR = rig.ankR.point();
    wing(ctx, aL.x - R*0.10, aL.y + R*0.02, -1, R*0.62);
    wing(ctx, aR.x + R*0.10, aR.y + R*0.02,  1, R*0.62);

    // 3) the petasos on the skull (hidden when he is turned away)
    if (!turnedAway){
      const sk = rig.skull.point();
      petasos(ctx, sk.x, sk.y, rig.skull.w.r, R);
    }

    // 4) the rhabdos — gripped in the right hand, tilted off vertical so it
    //    runs as a diagonal across empty paper and stays inside the frame.
    const h = rig.haR.point();
    const tilt = typeof state.wandTilt==="number" ? state.wandTilt : 0.26;
    const len  = R * (typeof state.wandLen==="number" ? state.wandLen : 3.30);
    if (state.wand !== false && !turnedAway){
      rhabdos(ctx, h.x, h.y, R, tilt, len);
    }

    // 5) the two diagram marks: PULL at the open gathering palm (collect the
    //    confused mass) and DRIVE at the wand tip (orient it and move it on).
    if (state.field !== false && !turnedAway){
      const lh = rig.haL.point();
      // pull sits clear of the palm's fingers, low and outboard of the hand
      pulse(ctx, lh.x - R*0.30, lh.y + R*0.46, R, -1, 0.74, W, H);
      const tx = h.x + Math.sin(tilt)*len, ty = h.y - Math.cos(tilt)*len;
      pulse(ctx, tx, ty, R, 1, 0.92, W, H);                     // drive, opening right
    }

    return out;
  },
};
export default asset;
