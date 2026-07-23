/* character.heracless-phantom — the dark armed double of Heracles in Hades.
   CHARACTER asset. In the House of the Dead (OD-B11-S08) Odysseus meets not
   Heracles himself — "he among the deathless gods delights in the feast" —
   but his PHANTOM (eidolon): a mighty shadow-shape forever frozen in the act
   of the hunt, bow drawn, arrow nocked, glaring about as if to loose at any
   moment, the dead scattering before it like startled birds.

   Built on the HALFTRACK hero rig. Distinct silhouette: a huge, broad,
   BEARDLESS strongman, bare warrior's body wrapped in the hide of the Nemean
   lion (its scalp worn as a hood, the snout jutting over his brow, the mane
   framing his head, the paws knotted at his chest), locked in a bow-drawn
   stance with a bespoke drawn-bow + arrow prop.

   IMPORTANT — this is NOT one of the pale ghosts. The atlas calls it a DARK
   menacing SHADOW-double, so unlike the wash-to-paper shades it is rendered
   SOLID and DARK: medium-dark warm-gray flesh (dense dots, still tonal — not
   a flat black blob), the lionskin + mane a step darker, the face marks and
   drawn bow the crisp black accents. It looms, it does not dissolve.

   EXPRESSIVENESS: the rig reads face channels from the composed POSE + a thin
   scene overlay. Heracles's phantom ships bespoke poses into the shared
   registry, each fusing a GRIM GLARE (brows crushed down, eyes narrowed to
   slits, mouth set hard) with an ARMED gesture — the whole affect is a single
   held threat: draw -> loom -> the words spoken from the dead -> the level
   hunter's glare. The bow + arrow are a bespoke prop anchored to the body so
   they read cleanly across poses. */
import { makeFigure, HERO_POSES, INK } from "../../engine/halfworld-engine.mjs";

/* ---- bespoke Heracles-phantom poses (additive; shared table). Distinct ids
   so they never collide with any other performer's poses. Convention: the
   LEFT arm is the bow arm (reaching down/out toward the grip, screen-left);
   the RIGHT arm is the draw arm (fist hauled up to the cheek on the string).
   The bow itself is drawn as a prop anchored to the torso, not to the hands,
   so it stays legible whatever the exact rig hand positions. ---- */

// THE CARD — BOW DRAWN, the held threat. Turned three-quarter into the hunt,
// left arm reaching out to the bow grip, right fist hauled back past the jaw
// on a full draw, chest opened. The face is all menace: brows crushed down and
// knit, eyes narrowed to hunting slits, mouth set hard, gaze off toward the
// quarry. A shadow about to loose.
HERO_POSES.her_draw = { id:"her_draw", label:"bow drawn, threatening", group:"heracles",
  n:{ browKnit:.76, browUp:.05, eyeNarrow:.54, frown:.42, mouthAsym:.1, jaw:.05,
      bodyYaw:-.3, headYaw:-.16, headPitch:-.02, gazeX:-.5, gazeY:.02,
      spineLean:-.04, chestOpen:.55,
      armLUpper:1.32, armLLower:-.3, handRotL:-.18, shoulderLiftL:.1,   // bow arm reaches out
      armRUpper:.52, armRLower:1.78, handRotR:.12, shoulderLiftR:.26,   // draw fist to the cheek
      rootScale:1.05 },
  opt:{ hands:["relaxed","fist"] } };

// LOOMING — stepping into the pit, drawing deeper, chin dropped so the glare
// comes from under the lion's brow. The menace advancing on the living.
HERO_POSES.her_loom = { id:"her_loom", label:"looming, deeper draw", group:"heracles",
  n:{ browKnit:.88, browUp:.03, eyeNarrow:.64, frown:.5, jaw:.03,
      bodyYaw:-.28, headYaw:-.14, headPitch:.14, gazeX:-.46, gazeY:.08,
      spineLean:-.12, chestOpen:.6, distance:1,
      armLUpper:1.38, armLLower:-.34, handRotL:-.18, shoulderLiftL:.12,
      armRUpper:.48, armRLower:1.9, handRotR:.14, shoulderLiftR:.3,
      rootScale:1.08 },
  opt:{ hands:["relaxed","fist"], action:"step_forward" } };

// SPEAKING FROM THE DEAD — the phantom's words. Bow lowered but still gripped
// out-left, the right arm flung FORWARD in a hard warning point, jaw parted on
// a grim vowel, brows raised-and-knit. It addresses Odysseus without ever
// lowering its guard.
HERO_POSES.her_speak = { id:"her_speak", label:"speaking from the dead", group:"heracles",
  n:{ browKnit:.6, browUp:.22, eyeNarrow:.32, frown:.3, jaw:.56, mouthAsym:.22,
      bodyYaw:-.2, headYaw:-.1, headPitch:-.02, gazeX:-.18, gazeY:0,
      spineLean:-.1, chestOpen:.48,
      armLUpper:1.1, armLLower:-.1, handRotL:-.14,                        // bow held out-left, lower
      armRUpper:-1.14, armRLower:.5, handRotR:.16, shoulderLiftR:.1,      // right arm thrust forward, warning
      rootScale:1.04 },
  opt:{ hands:["relaxed","point"] } };

// LEVEL GLARE — the hunter at rest, bow held across the front, body squared
// three-quarter, a flat murderous stare. Staging continuity beat.
HERO_POSES.her_glare = { id:"her_glare", label:"level hunter's glare", group:"heracles",
  n:{ browKnit:.58, browUp:.04, eyeNarrow:.44, frown:.3, mouthAsym:.06,
      bodyYaw:-.46, headYaw:-.28, gazeX:-.24, gazeY:0,
      chestOpen:.4, spineLean:-.02,
      armLUpper:1.06, armLLower:-.04, handRotL:-.12,   // bow gripped out-front
      armRUpper:-.2, armRLower:.32,                    // right arm low, ready
      rootScale:1.05 },
  opt:{ hands:["relaxed","relaxed"] } };

/* dark shadow-double flesh: a medium-dark warm gray (dense dots, still tonal),
   near-black hair under the hide, no beard, bare warrior's body + legs. Scaled
   only slightly up so the lion-scalp hood clears the top of the frame. */
const params = {
  skin:"#756d62", hairColor:"#211d19",
  hair:"short", beard:false, glasses:false,
  garment:"bare", cloak:false, bareLegs:true, scale:1.0,
};

const fig = makeFigure(params);

/* headR the rig will use, so overlays scale with the figure */
function headRadius(W, H){
  const Hh = Math.min(H*0.9, W*1.26) * (params.scale||1);
  return Hh*0.105;
}

/* ---- NEMEAN LIONSKIN HOOD, drawn as a bespoke overlay framing the head ----
   The lion's scalp worn as a helmet: a small snout/scalp jutting over the
   brow, two ears, and a shaggy mane framing ONLY the crown and upper sides so
   the phantom's glaring face stays open below. Flat solid darks + hard contour
   (the POST pass supplies the dots); a couple of lighter tufts keep it from
   flattening to one black mass. A step darker than the flesh. */
function drawLionskin(ctx, hx, hy, R){
  const dark = "#332e28", darker = "#221e19", tuft = "#514a40";
  ctx.save();
  ctx.lineJoin = "round"; ctx.lineCap = "round";

  // --- mane: a scalloped shaggy arc over the top ~200°, framing crown + temples.
  //     Built from overlapping lobes so the outer edge is ragged. Kept above the
  //     brow so it never covers the eyes.
  ctx.fillStyle = dark; ctx.strokeStyle = INK; ctx.lineWidth = 3.5;
  const lobes = 15;
  ctx.beginPath();
  const a0 = Math.PI*0.06, a1 = Math.PI*0.94;   // temple to temple, over the top
  for (let i=0;i<=lobes;i++){
    const a = a0 + (a1-a0)*(i/lobes);
    const rr = R*(1.02 + (i%2?0.13:0.0));
    const x = hx - Math.cos(a)*rr;          // left temple -> right temple
    const y = hy - Math.sin(a)*rr - R*0.02;
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  // inner edge back across just above the brow
  ctx.lineTo(hx + R*0.9, hy - R*0.28);
  ctx.lineTo(hx - R*0.9, hy - R*0.28);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // a few lighter fur tufts in the mane (tonal relief)
  ctx.fillStyle = tuft;
  for (let i=-3;i<=3;i++){
    const a = Math.PI*0.5 + i*0.32;
    const rr = R*0.9;
    ctx.beginPath();
    ctx.ellipse(hx - Math.cos(a)*rr, hy - Math.sin(a)*rr - R*0.08,
                R*0.09, R*0.17, -a+Math.PI/2, 0, Math.PI*2);
    ctx.fill();
  }

  // --- ears: two rounded tufted triangles at the top corners
  ctx.fillStyle = dark; ctx.strokeStyle = INK; ctx.lineWidth = 3.5;
  for (const es of [-1,1]){
    ctx.beginPath();
    ctx.moveTo(hx + es*R*0.48, hy - R*0.92);
    ctx.quadraticCurveTo(hx + es*R*0.74, hy - R*1.34, hx + es*R*0.82, hy - R*0.94);
    ctx.quadraticCurveTo(hx + es*R*0.72, hy - R*0.82, hx + es*R*0.48, hy - R*0.92);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = darker;
    ctx.beginPath();
    ctx.moveTo(hx + es*R*0.56, hy - R*0.96);
    ctx.quadraticCurveTo(hx + es*R*0.70, hy - R*1.20, hx + es*R*0.74, hy - R*0.98);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = dark;
  }

  // --- lion SNOUT / scalp jutting over the brow: a small upper muzzle worn
  //     like a visor above the forehead, with a dark nose pad + hollow sockets.
  //     Its lower edge stays above the phantom's brow (~hy - R*0.28).
  ctx.fillStyle = dark; ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(hx - R*0.5, hy - R*0.30);
  ctx.quadraticCurveTo(hx - R*0.56, hy - R*0.86, hx - R*0.22, hy - R*0.98);
  ctx.quadraticCurveTo(hx,          hy - R*1.04, hx + R*0.22, hy - R*0.98);
  ctx.quadraticCurveTo(hx + R*0.56, hy - R*0.86, hx + R*0.5, hy - R*0.30);
  ctx.quadraticCurveTo(hx + R*0.24, hy - R*0.40, hx, hy - R*0.34);
  ctx.quadraticCurveTo(hx - R*0.24, hy - R*0.40, hx - R*0.5, hy - R*0.30);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // muzzle centre ridge + nose pad
  ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(hx, hy - R*0.92); ctx.lineTo(hx, hy - R*0.42); ctx.stroke();
  ctx.fillStyle = darker;
  ctx.beginPath(); ctx.ellipse(hx, hy - R*0.40, R*0.13, R*0.09, 0, 0, Math.PI*2); ctx.fill();
  // hollow lion eye-sockets on the scalp
  for (const es of [-1,1]){
    ctx.beginPath();
    ctx.ellipse(hx + es*R*0.28, hy - R*0.66, R*0.10, R*0.13, 0, 0, Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

/* ---- KNOTTED LION PAWS at the chest, drawn as a bespoke overlay ----
   The forepaws of the hide knotted over the sternum, claws splayed. Small,
   dark, one crisp mark of the hero's attribute. */
function drawPaws(ctx, cx, cy, R){
  const dark = "#302b25", darker = "#201c17";
  ctx.save();
  ctx.lineJoin = "round"; ctx.lineCap = "round";
  ctx.fillStyle = dark; ctx.strokeStyle = INK; ctx.lineWidth = 3.5;
  // central knot
  ctx.beginPath();
  ctx.ellipse(cx, cy, R*0.2, R*0.16, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  // two paws hanging from the knot
  for (const es of [-1,1]){
    ctx.beginPath();
    ctx.moveTo(cx + es*R*0.08, cy + R*0.05);
    ctx.quadraticCurveTo(cx + es*R*0.34, cy + R*0.2, cx + es*R*0.28, cy + R*0.5);
    ctx.quadraticCurveTo(cx + es*R*0.14, cy + R*0.56, cx + es*R*0.05, cy + R*0.4);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
    for (let k=-1;k<=1;k++){
      ctx.beginPath();
      ctx.moveTo(cx + es*R*0.21 + k*R*0.05, cy + R*0.47);
      ctx.lineTo(cx + es*R*0.21 + k*R*0.05, cy + R*0.58);
      ctx.stroke();
    }
    ctx.fillStyle = dark;
  }
  ctx.restore();
}

/* ---- the GREAT BOW + ARROW, a bespoke prop anchored to the TORSO ----
   grip on the left (forward, toward the quarry), nock hauled to the right near
   the cheek. Two modes: drawn (taut triangle + nocked arrow — the whole point
   of the phantom) and held (gripped, slack string, no arrow). Flat solid darks
   + hard contour; the string + arrow are the crisp black lines. */
function drawBow(ctx, grip, nock, R, mode){
  const wood = "#3d3529", woodDeep = "#241f18";
  const G = grip;
  const limb = R*2.1;
  const T = { x: G.x + R*0.14, y: G.y - limb };
  const B = { x: G.x + R*0.14, y: G.y + limb };
  const belly = { x: G.x - R*0.9, y: G.y };   // belly bows further left (toward quarry)

  ctx.save();
  ctx.lineCap = "round"; ctx.lineJoin = "round";

  // bow stave (thick contour wood)
  ctx.strokeStyle = INK; ctx.lineWidth = R*0.19;
  ctx.beginPath(); ctx.moveTo(T.x,T.y); ctx.quadraticCurveTo(belly.x,belly.y,B.x,B.y); ctx.stroke();
  ctx.strokeStyle = wood; ctx.lineWidth = R*0.11;
  ctx.beginPath(); ctx.moveTo(T.x,T.y); ctx.quadraticCurveTo(belly.x,belly.y,B.x,B.y); ctx.stroke();
  // grip wrap darker at centre
  ctx.strokeStyle = woodDeep; ctx.lineWidth = R*0.14;
  ctx.beginPath();
  ctx.moveTo(G.x - R*0.28, G.y - R*0.34);
  ctx.quadraticCurveTo(belly.x + R*0.2, G.y, G.x - R*0.28, G.y + R*0.34);
  ctx.stroke();

  if (mode === "drawn" && nock){
    const N = nock;
    // string: taut triangle T -> N -> B
    ctx.strokeStyle = INK; ctx.lineWidth = Math.max(2, R*0.032);
    ctx.beginPath(); ctx.moveTo(T.x,T.y); ctx.lineTo(N.x,N.y); ctx.lineTo(B.x,B.y); ctx.stroke();
    // arrow: from the nock through the grip, out past the belly toward the quarry
    const dx = belly.x - N.x, dy = belly.y - N.y, dl = Math.hypot(dx,dy)||1;
    const ux = dx/dl, uy = dy/dl;
    const tip = { x: N.x + ux*(dl + R*0.5), y: N.y + uy*(dl + R*0.5) };
    ctx.strokeStyle = INK; ctx.lineWidth = Math.max(3, R*0.05);
    ctx.beginPath(); ctx.moveTo(N.x, N.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
    // arrowhead
    const px = -uy, py = ux;
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.moveTo(tip.x, tip.y);
    ctx.lineTo(tip.x - ux*R*0.32 + px*R*0.16, tip.y - uy*R*0.32 + py*R*0.16);
    ctx.lineTo(tip.x - ux*R*0.32 - px*R*0.16, tip.y - uy*R*0.32 - py*R*0.16);
    ctx.closePath(); ctx.fill();
    // fletching at the nock
    ctx.strokeStyle = INK; ctx.lineWidth = Math.max(2, R*0.028);
    for (const s of [-1,1]){
      ctx.beginPath();
      ctx.moveTo(N.x, N.y);
      ctx.lineTo(N.x - ux*R*0.34 + px*s*R*0.13, N.y - uy*R*0.34 + py*s*R*0.13);
      ctx.stroke();
    }
  } else {
    // held: slack string, straight chord T -> B, no arrow
    ctx.strokeStyle = INK; ctx.lineWidth = Math.max(2, R*0.028);
    ctx.beginPath(); ctx.moveTo(T.x, T.y); ctx.lineTo(B.x, B.y); ctx.stroke();
  }
  ctx.restore();
}

export const asset = {
  id:"character.heracless-phantom",
  type:"CHARACTER",
  name:"Heracles's phantom",
  statusWord:"MENACING",
  scene:"OD-B11-S08",

  params,
  layers:["shadow","hair-back","legs","torso","far-arm","neck","head","face",
          "lionskin","paws","near-arm","bow"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.10}, eyes:{x:.50,y:.20},
    lionSnout:{x:.50,y:.11},
    bowGrip:{x:.32,y:.44}, drawHand:{x:.58,y:.28}, arrowTip:{x:.14,y:.44},
    rightHand:{x:.58,y:.28}, leftHand:{x:.32,y:.44},
    chestKnot:{x:.50,y:.38}, hip:{x:.50,y:.64}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"drawing",
    nodes:{
      // OD-B11-S08 — the phantom's arc. Every beat is a held threat + a glare.
      // THE signature: bow drawn full, arrow nocked, grim glare toward the quarry.
      drawing:  { preview:{ pose:"her_draw", gaze:{x:-.5,y:.02},
                            browKnit:.76, eyeNarrow:.54, frown:.42, jaw:.05,
                            t:0.5, status:"MENACING" } },
      // looming in on the living, chin dropped, drawing deeper
      looming:  { preview:{ pose:"her_loom", gaze:{x:-.46,y:.08},
                            browKnit:.88, eyeNarrow:.64, frown:.5,
                            t:0.5, status:"LOOMING" } },
      // speaking from the dead — bow lowered, a warning thrust, jaw open
      speaking: { preview:{ pose:"her_speak", gaze:{x:-.18,y:0},
                            browKnit:.6, browUp:.22, eyeNarrow:.32, jaw:.56, mouthAsym:.22,
                            t:0.5, status:"SPEAKING" } },
      // the level hunter's glare — staging continuity, still murderous
      glaring:  { preview:{ pose:"her_glare", gaze:{x:-.24,y:0},
                            browKnit:.58, eyeNarrow:.44, frown:.3,
                            t:0.5, status:"GRIM" } },
    },
    edges:[
      ["drawing","looming"],["looming","speaking"],["speaking","drawing"],
      ["drawing","glaring"],["glaring","drawing"],["speaking","glaring"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band","draw",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym","blink"],

  // CARD SIGNATURE — MENACING: the dark double of Heracles frozen at full
  // draw, turned three-quarter into the hunt, the great bow bent, the arrow
  // nocked and sighted, the Nemean lion's scalp hooding his brow — and the
  // face all threat: brows crushed down, eyes slit, gaze off toward the quarry.
  // Solid and dark where the other ghosts wash pale.
  preview:()=>({ pose:"her_draw", gaze:{x:-.5,y:.02},
                 browKnit:.76, browUp:.05, eyeNarrow:.54, frown:.42, jaw:.05,
                 t:0.5, status:"MENACING", progress:.26 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";

    // SOLID + DARK — no wash to paper. The whole point: a menacing shadow that
    // looms among the pale dead. Draw at full ink.
    const r = fig.draw(ctx, W, H, st);
    const A = (r && r.anchors) || {};
    const R = headRadius(W, H);
    const cx = W*0.5;

    const head = A.head ? { x:A.head.x*W, y:A.head.y*H } : { x:cx, y:H*0.20 };
    const hip  = A.hip  ? { x:A.hip.x*W,  y:A.hip.y*H  } : { x:cx, y:H*0.62 };

    // the lion's scalp hoods the head; knotted paws ride the upper chest
    drawLionskin(ctx, head.x, head.y - R*0.02, R);
    const chestY = head.y + (hip.y - head.y)*0.4;
    drawPaws(ctx, (head.x+hip.x)/2, chestY, R);

    // the bow, anchored to the torso. Drawn-mode for the draw/loom beats.
    const pose = st.pose || "her_draw";
    const drawn = (typeof st.draw === "boolean") ? st.draw
                : (pose === "her_draw" || pose === "her_loom");
    // aim down a level shaft: grip and nock share a height (cheek/eye level) so
    // the drawn arrow runs horizontal toward the quarry — the sighting read.
    const aimY = head.y + R*0.52;
    const grip = drawn ? { x: cx - R*1.7, y: aimY }
                       : { x: cx - R*1.7, y: chestY + R*0.15 };
    const nock = { x: cx + R*0.5, y: aimY };
    drawBow(ctx, grip, drawn ? nock : null, R, drawn ? "drawn" : "held");

    return r;
  },
};
export default asset;
