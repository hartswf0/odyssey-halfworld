/* character.hermes-as-young-man — Hermes disguised on the road to Circe's hall.
   CHARACTER asset. Scene function (OD-B10-S05): the friendly roadside guide
   who stops Odysseus on the path, reveals divine knowledge, hands over the
   moly, and lays out the tactical sequence for facing the witch.

   This is a HERMES VARIANT held to the base-Hermes identity (young, beardless,
   lithe traveller in a short chiton + chlamys, dark tousled hair, bare legs +
   sandals) but STRIPPED of every divine tell: NO petasos, NO winged sandals,
   NO caduceus. In their place he carries the one prop that gives the guise its
   purpose — the moly plant, Homer's herb with the "black root and milk-white
   flower" — extended in an open, offering gesture. The only trace of the god
   left showing is a subtle divine gleam kindled in one eye (drawn on top of
   the rig after it renders). A "friendly youth" who happens to know too much. */
import { makeFigure, INK, ACCENT } from "../../engine/halfworld-engine.mjs";

const params = {
  skin:"#d7c3a4", hairColor:"#2a2016",        // same youthful skin + dark hair as base Hermes
  hair:"short", beard:false, glasses:false,   // beardless young man
  garment:"tunic", cloak:true, bareLegs:true, // short chiton, traveller's chlamys, bare legs + sandals
  scale:0.97,                                 // lithe, quick build (matches base Hermes)
};

const fig = makeFigure(params);

/* ---- moly palette (solid grays + hard contour; the engine POST pass
   supplies the halftone, so no pre-dithering here). The luminance split is
   the whole point: the flower renders near-white (few halftone dots) and the
   root near-black (dense dots) — exactly the black-root / milk-white-flower
   herb of Book 10. ---- */
const STEM_GREEN = "#7c7c72";   // mid stem/leaf gray
const LEAF_GREEN = "#8c8c82";   // a touch paler for the leaf planes
const FLOWER_PALE= "#f0ede6";   // milk-white bloom
const FLOWER_EYE = "#b9b9b0";   // little shaded flower centre
const ROOT_DARK  = "#181814";   // black root bulb + tendrils

/* Draw the moly held in an offered hand at (hx,hy), presented toward `dir`
   (+1 reaches out to the figure's right / screen-right). `R` is the rig head
   radius, used to scale the herb to the body. The plant is drawn as: a dark
   root cluster dangling from the grip, a curving stem, two leaves, and a
   milk-white five/six-point bloom crowning it. */
function moly(ctx, hx, hy, dir, R){
  ctx.save();
  ctx.translate(hx, hy);
  const L = R * 1.9;                 // overall stem length
  const tipX =  dir * R * 0.55;      // bloom leans outward, presented
  const tipY = -L;                   // and up, above the hand
  const midX =  dir * R * 0.18;
  const midY = -L * 0.5;

  // helper: a point on the stem's quadratic at parameter u (0=grip,1=bloom)
  const stemAt = (u) => {
    const b0x = 0, b0y = R*0.30;
    const x = (1-u)*(1-u)*b0x + 2*(1-u)*u*midX + u*u*tipX;
    const y = (1-u)*(1-u)*b0y + 2*(1-u)*u*midY + u*u*tipY;
    return { x, y };
  };

  // --- compact root tuft below the grip (the black root) ---
  ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.lineCap = "round";
  ctx.fillStyle = ROOT_DARK;
  ctx.beginPath();
  ctx.ellipse(0, R*0.42, R*0.14, R*0.18, 0, 0, Math.PI*2);   // small root bulb
  ctx.fill(); ctx.stroke();
  ctx.strokeStyle = ROOT_DARK; ctx.lineWidth = 2;
  for (const s of [-1, -0.4, 0.4, 1]){                        // fine tendrils
    ctx.beginPath();
    ctx.moveTo(s*R*0.07, R*0.55);
    ctx.quadraticCurveTo(s*R*0.20, R*0.74, s*R*0.14, R*0.92);
    ctx.stroke();
  }

  // --- stem, curving from grip up to the bloom ---
  ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(0, R*0.30);
  ctx.quadraticCurveTo(midX, midY, tipX, tipY); ctx.stroke();
  ctx.strokeStyle = STEM_GREEN; ctx.lineWidth = 3.4;
  ctx.beginPath(); ctx.moveTo(0, R*0.30);
  ctx.quadraticCurveTo(midX, midY, tipX, tipY); ctx.stroke();

  // --- two clean almond leaves growing off the stem ---
  ctx.fillStyle = LEAF_GREEN; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.lineJoin = "round";
  const leaf = (base, ang, len) => {                          // almond from base along ang
    const wx = Math.cos(ang), wy = Math.sin(ang);             // leaf axis
    const px = -wy, py = wx;                                  // perpendicular
    const tip = { x: base.x + wx*len,        y: base.y + wy*len };
    const bel = len*0.28;                                     // belly width
    ctx.beginPath();
    ctx.moveTo(base.x, base.y);
    ctx.quadraticCurveTo(base.x + wx*len*0.5 + px*bel, base.y + wy*len*0.5 + py*bel, tip.x, tip.y);
    ctx.quadraticCurveTo(base.x + wx*len*0.5 - px*bel, base.y + wy*len*0.5 - py*bel, base.x, base.y);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  };
  leaf(stemAt(0.42), Math.atan2(-1, dir*1.1), R*0.62);        // lower leaf, angled up-out
  leaf(stemAt(0.66), Math.atan2(-1.1, -dir*0.9), R*0.55);     // upper leaf, angled up-in

  // --- milk-white bloom crowning the stem ---
  ctx.save();
  ctx.translate(tipX, tipY);
  ctx.fillStyle = FLOWER_PALE; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.lineJoin = "round";
  const petals = 6, pr = R*0.40;
  ctx.beginPath();
  for (let i=0; i<petals; i++){
    const a = (i/petals)*Math.PI*2 - Math.PI/2;
    const a2 = ((i+0.5)/petals)*Math.PI*2 - Math.PI/2;
    const px = Math.cos(a)*pr,  py = Math.sin(a)*pr;
    const vx = Math.cos(a2)*pr*0.34, vy = Math.sin(a2)*pr*0.34;
    if (i===0) ctx.moveTo(px, py);
    else ctx.quadraticCurveTo(vx, vy, px, py);
  }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // shaded flower centre
  ctx.fillStyle = FLOWER_EYE;
  ctx.beginPath(); ctx.arc(0, 0, pr*0.30, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.restore();

  ctx.restore();
}

export const asset = {
  id:"character.hermes-as-young-man",
  type:"CHARACTER",
  name:"Hermes as young man",
  statusWord:"KNOWING",
  scene:"OD-B10-S05",

  params,
  layers:["shadow","hair-back","legs","torso","cloak","far-arm",
          "neck","head","face","hair-front","near-arm","moly","divine-eye"],
  // normalized 0..1 anchors for scene attachment / gaze / the offered herb
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.11}, eyes:{x:.50,y:.20},
    rightHand:{x:.66,y:.60}, leftHand:{x:.34,y:.60},
    molyGrip:{x:.68,y:.58}, molyBloom:{x:.74,y:.40},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"guiding",
    nodes:{
      // SIGNATURE beat — the friendly guide steps up and OFFERS the moly:
      // right hand extended with the herb, a warm knowing half-smile, brows a
      // touch raised, gaze meeting the traveller's. moly shown.
      guiding:   { preview:{ pose:"offering_hand", gaze:{x:.24,y:.02},
                             smile:.34, browUp:.24, mouthAsym:.18,
                             moly:true, gleam:true, t:0.5 } },
      // revealing divine knowledge — leans in, MOUTH OPEN mid-explanation
      // (jaw parts, teeth show), brows lifted, eyes a little wide as he tells
      // Odysseus what the witch will do. moly still offered.
      revealing: { preview:{ pose:"lean_forward", gaze:{x:.18,y:-.04},
                             jaw:.6, smile:.2, browUp:.42, eyeWide:.22,
                             moly:true, gleam:true, t:0.5 } },
      // the tactical sequence — points down the road / lays out the plan,
      // knowing narrowed eyes, a set half-smile. herb lowered out of the
      // pointing line so the gesture reads clean.
      instructing:{ preview:{ pose:"pointing_arm", gaze:{x:-.4,y:0},
                             smile:.16, browKnit:.2, eyeNarrow:.24, mouthAsym:.3,
                             moly:false, gleam:true, t:0.45 } },
      // the guise held quiet — a three-quarter roadside stance, faint smile,
      // just a youth on the path (the gleam still there if you look).
      wayfarer:  { preview:{ pose:"three_quarter_left", gaze:{x:-.16,y:.04},
                             smile:.12, browUp:.08, moly:true, gleam:true, t:0.5 } },
      // stable identity turn
      profile:   { preview:{ pose:"profile_left", gaze:{x:-.3,y:0}, smile:.1,
                             moly:true, gleam:false, t:0.5 } },
    },
    edges:[
      ["guiding","revealing"],["revealing","instructing"],["instructing","guiding"],
      ["guiding","wayfarer"],["wayfarer","guiding"],["wayfarer","profile"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — KNOWING. Hermes in mortal guise, caught in the moment of
  // the gift: right arm extended with the moly held out (offering_hand), a warm
  // half-smile skewed by a knowing tilt (smile + mouthAsym), brows lifted, and
  // a gaze that meets you a beat too steadily. The moly's black root and
  // milk-white bloom read even under the halftone; a faint gleam in one eye is
  // the only tell that the friendly youth is a god.
  preview:()=>({ pose:"offering_hand", gaze:{x:.24,y:.02},
                 smile:.34, browUp:.24, mouthAsym:.18, t:0.5,
                 moly:true, gleam:true, status:"KNOWING", progress:.2 }),

  draw(ctx, W, H, state={}){
    if (state && state.band) fig.spec.band = state.band;
    // 1) the rig, in solid grays + contour
    const out = fig.draw(ctx, W, H, state);
    const rig = fig.hero.rig, d = rig.dim, R = d.headR;

    const turnedAway = (state.pose==="back_view" || state.band==="back");

    // 2) the moly — held/offered in the right hand. Default on unless a state
    //    explicitly stows it (moly:false) for a clean pointing/walking line.
    if (state.moly !== false && !turnedAway){
      const h = rig.haR.point();
      // present toward whichever side the hand sits relative to the body
      const bodyX = rig.pelvis.point().x;
      const dir = h.x >= bodyX ? 1 : -1;
      moly(ctx, h.x, h.y, dir, R);
    }

    // 3) the divine gleam — a subtle bright spark kindled in one eye, the only
    //    trace of the god left showing through the disguise. Drawn in the
    //    skull's local frame so it tracks head turn; skipped on profile/back.
    if (state.gleam !== false && !turnedAway){
      const sk = rig.skull.point();
      const yawSide = Math.sin((state.headYaw||0));
      // don't draw on a hard profile where the far eye vanishes
      const profile = Math.abs(Math.sin((state.pose && state.pose.includes("profile"))?1.3:0)) > 0.72;
      if (!profile){
        ctx.save();
        ctx.translate(sk.x, sk.y);
        ctx.rotate(rig.skull.w.r);
        const eyeY = -R*0.10, eyeDx = R*0.34;
        // sit the glint in the UPPER-OUTER corner of the figure's right eye so
        // the pupil/lid still read as an eye — a catchlight, not a hole.
        const ex = eyeDx + R*0.05, ey = eyeY - R*0.045;
        // tiny four-point sparkle — the god's light leaking through the guise
        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = R*0.018; ctx.lineCap="round";
        ctx.beginPath();
        ctx.moveTo(ex - R*0.055, ey); ctx.lineTo(ex + R*0.055, ey);
        ctx.moveTo(ex, ey - R*0.055); ctx.lineTo(ex, ey + R*0.055);
        ctx.stroke();
        // small bright core
        ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(ex, ey, R*0.022, 0, Math.PI*2); ctx.fill();
        // a single ACCENT-blue pin at the centre — reads as divine, ties to the
        // card's blue mark; kept tiny so it stays "subtle"
        ctx.fillStyle = ACCENT;
        ctx.beginPath(); ctx.arc(ex, ey, R*0.010, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }
    }

    return out;
  },
};
export default asset;
