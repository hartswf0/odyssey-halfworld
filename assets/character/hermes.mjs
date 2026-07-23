/* character.hermes — the swift messenger of the gods, Argeiphontes.
   CHARACTER asset. Scene function (OD-B01-S02): named but not yet
   dispatched — held ready as the divine messenger asset. Built on the
   HALFTRACK hero rig: a young, beardless, lithe traveller in a short
   tunic and traveller's cloak, marked by three identity props layered
   over the rig — the broad-brimmed traveller's cap (petasos), the winged
   sandals (talaria) at both ankles, and the herald's staff (caduceus)
   held at rest. Stable identity across front/three-quarter/profile/back;
   face, gaze, mouth, hands, and every joint stay exposed to the rig so
   scenes can dispatch, fly, and deliver through him. The caduceus is a
   capability — drawn when state.staff is set (default in the neutral
   "available" pose), stowed for pure locomotion turns. */
import { makeFigure, INK } from "../../engine/halfworld-engine.mjs";

const params = {
  skin:"#d7c3a4", hairColor:"#2a2016",       // youthful, dark tousled hair
  hair:"short", beard:false, glasses:false,
  garment:"tunic", cloak:true, bareLegs:true, // short chiton, chlamys, bare legs + sandals
  scale:0.97,                                 // lithe, quick build
};

const fig = makeFigure(params);

/* ---- identity-prop palette (solid grays + hard contour; the engine's
   POST pass supplies the halftone, so no pre-dithering here) ---- */
const CAP_FELT   = "#63635b";   // petasos crown — mid felt, distinct from hair
const CAP_BRIM   = "#4c4c44";   // brim underside, a touch deeper
const WING_PALE  = "#dcd7cd";   // feathers — pale so they read against skin/ink
const STAFF_ROD  = "#8f8f87";   // caduceus shaft
const STAFF_KNOB = "#6f6f68";

/* one feathered wing, anchored at (ax,ay), splaying toward `dir` (+1/-1),
   spanning `len`. Drawn as a solid pale plane + a couple of ink feather
   seams so the dotify pass keeps it legible. */
function wing(ctx, ax, ay, dir, len){
  ctx.save();
  ctx.translate(ax, ay);
  ctx.scale(dir, 1);
  ctx.fillStyle = WING_PALE; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(len*0.55, -len*0.60, len*1.06, -len*0.44);  // leading edge out+up
  ctx.quadraticCurveTo(len*0.80, -len*0.12, len*0.64, -len*0.18);  // trailing scallops back
  ctx.quadraticCurveTo(len*0.52, -len*0.02, len*0.42, -len*0.07);
  ctx.quadraticCurveTo(len*0.31,  len*0.07, len*0.22,  0.0);
  ctx.quadraticCurveTo(len*0.11,  len*0.06, 0, 0);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // feather seams
  ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.lineCap = "round";
  for (const [sx,sy] of [[0.20,-0.06],[0.34,-0.12],[0.50,-0.20]]){
    ctx.beginPath();
    ctx.moveTo(len*0.06, len*0.02);
    ctx.quadraticCurveTo(len*(sx*0.7), -len*(sy* -1)*0.0, len*sx, -len*(-sy));
    ctx.stroke();
  }
  ctx.restore();
}

export const asset = {
  id:"character.hermes",
  type:"CHARACTER",
  name:"Hermes",
  statusWord:"SWIFT",
  scene:"OD-B01-S02",

  params,
  layers:["shadow","hair-back","legs","sandal-wings","torso","cloak","far-arm",
          "neck","head","face","hair-front","petasos","near-arm","caduceus"],
  // normalized 0..1 anchors for scene attachment / gaze / props / flight
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.10}, eyes:{x:.50,y:.20},
    rightHand:{x:.66,y:.60}, leftHand:{x:.34,y:.60},
    caduceusGrip:{x:.66,y:.58}, hip:{x:.50,y:.66},
    leftSandal:{x:.42,y:.92}, rightSandal:{x:.58,y:.92}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"available",
    nodes:{
      // OD-B01-S02: named, poised, staff at rest — a contrapposto stance
      // (weight on one hip, never straight-hanging) with a faint ready smile.
      available:  { preview:{ pose:"weight_shift", gaze:{x:.14,y:.02}, mouth:.16, staff:true } },
      // being named by the council — quarter turn, leaning in to listen,
      // brows a touch lifted (the pose carries browUp via palm_up? no — this
      // stays attentive-neutral, distinct from the smiling states).
      named:      { preview:{ pose:"three_quarter_left", gaze:{x:-.22,y:.04}, mouth:.06, staff:true } },
      // dispatched: takes flight — left arm thrust to the sky, staff clean at
      // the right side, eyes up, a driven half-smile. Launch beat.
      dispatched: { preview:{ pose:"one_arm_raised", gaze:{x:.15,y:-.28}, mouth:.5, staff:true } },
      // in motion between worlds — pure locomotion, staff stowed, quiet grin.
      flying:     { preview:{ pose:"walk_neutral", gaze:{x:.1,y:-.05}, mouth:.2, staff:false } },
      // delivering the word — free (left) hand thrown forward to present the
      // message, MOUTH OPEN mid-speech (jaw parts, teeth show), gaze ahead.
      // Right hand stays low so the caduceus reads as gripped, not floating.
      delivering: { preview:{ pose:"open_palm", gaze:{x:.3,y:.02}, mouth:.8, staff:true } },
      // stable identity turns
      profile:    { preview:{ pose:"profile_left", gaze:{x:-.3,y:0}, mouth:.1, staff:true } },
      back:       { preview:{ pose:"back_view", staff:false } },
    },
    edges:[
      ["available","named"],["named","dispatched"],["dispatched","flying"],
      ["flying","delivering"],["delivering","flying"],["flying","available"],
      ["available","profile"],["available","back"],["dispatched","available"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band"],

  // SIGNATURE — SWIFT. The messenger caught in the launch beat: the free
  // (left) arm is flung to the sky (one_arm_raised) while the right hand keeps
  // the caduceus gripped vertical at his side — so the staff reads clean, not
  // floating. A confident, lips-parted half-smile (mouth ~.58 just parts the
  // jaw) and an alert gaze thrown forward-and-up along the road. Hat + winged
  // sandals + caduceus all kept. Face AND the whole arm/torso line emote.
  preview:()=>({ pose:"one_arm_raised", gaze:{x:.28,y:-.16}, mouth:.68, t:0.5,
                 staff:true, status:"SWIFT", progress:.2 }),

  draw(ctx, W, H, state={}){
    if (state && state.band) fig.spec.band = state.band;
    // 1) the rig, in solid grays + contour
    const out = fig.draw(ctx, W, H, state);
    const rig = fig.hero.rig, d = rig.dim, R = d.headR;

    // orientation: hide face-front props when the figure is turned away
    const yaw = (state.pose==="back_view" || state.band==="back");

    // 2) winged sandals (talaria) — both ankles, splaying outward + up
    const aL = rig.ankL.point(), aR = rig.ankR.point();
    wing(ctx, aL.x - R*0.10, aL.y + R*0.02, -1, R*0.62);
    wing(ctx, aR.x + R*0.10, aR.y + R*0.02,  1, R*0.62);

    // 3) traveller's cap (petasos) — broad brim + low crown, on the skull
    if (!yaw){
      const sk = rig.skull.point();
      ctx.save();
      ctx.translate(sk.x, sk.y);
      ctx.rotate(rig.skull.w.r);
      // brim: a wide flat ellipse sitting at the hairline
      ctx.fillStyle = CAP_BRIM; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.ellipse(0, -R*0.44, R*1.62, R*0.34, 0, 0, Math.PI*2);
      ctx.fill(); ctx.stroke();
      // low domed crown above the brim
      ctx.fillStyle = CAP_FELT;
      ctx.beginPath();
      ctx.moveTo(-R*0.86, -R*0.44);
      ctx.quadraticCurveTo(-R*0.72, -R*1.28, 0, -R*1.30);
      ctx.quadraticCurveTo( R*0.72, -R*1.28, R*0.86, -R*0.44);
      ctx.quadraticCurveTo( R*0.44, -R*0.66, 0, -R*0.66);
      ctx.quadraticCurveTo(-R*0.44, -R*0.66, -R*0.86, -R*0.44);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // brim front lip highlight seam
      ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(-R*1.4, -R*0.40); ctx.quadraticCurveTo(0, -R*0.24, R*1.4, -R*0.40); ctx.stroke();
      ctx.restore();
    }

    // 4) herald's staff (caduceus) — capability; drawn at the right hand
    if (state.staff){
      const h  = rig.haR.point();
      const sk = rig.skull.point();
      const topY = Math.min(sk.y - R*1.55, h.y - R*3.0);
      const botY = h.y + R*1.15;
      const x = h.x;
      // shaft
      ctx.fillStyle = STAFF_ROD; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
      const rw = R*0.11;
      ctx.beginPath();
      ctx.moveTo(x-rw, topY+R*0.2); ctx.lineTo(x+rw, topY+R*0.2);
      ctx.lineTo(x+rw, botY); ctx.lineTo(x-rw, botY);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // twin snakes — two crossing curves up the shaft
      ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.lineCap = "round";
      const span = botY - (topY+R*0.5), n = 4;
      for (const s of [-1, 1]){
        ctx.beginPath();
        ctx.moveTo(x, botY);
        for (let i=1;i<=n;i++){
          const ty = botY - span*(i/n);
          const cx = x + s*rw*2.2*((i%2)?1:-1);
          const py = botY - span*((i-0.5)/n);
          ctx.quadraticCurveTo(cx, py, x, ty);
        }
        ctx.stroke();
      }
      // knob + twin wings crowning the staff
      ctx.fillStyle = STAFF_KNOB; ctx.strokeStyle = INK; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(x, topY+R*0.2, R*0.16, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      wing(ctx, x - R*0.06, topY+R*0.16, -1, R*0.5);
      wing(ctx, x + R*0.06, topY+R*0.16,  1, R*0.5);
    }

    return out;
  },
};
export default asset;
