/* character.eumaeus — the loyal weathered swineherd of Ithaca.
   CHARACTER asset. A sturdy middle-aged-to-older herdsman in a rough belted
   tunic under a heavy hide cloak, weathered bearded face, leaning on a tall
   herdsman's staff. The most hospitable man in the poem: he moves from a
   protective stone-throwing ward into a warm open-handed welcome, and carries a
   kindly grieving loyalty through every scene.
   Atlas performances (Book 14, the swineherd's steading):
     OD-B14-S01 — weathered swineherd moving from protective action to hospitality
     OD-B14-S02 — loyal servant speaking grief, anger, skepticism, generosity
     OD-B14-S03 — absorbed compassionate listener with one firm boundary of disbelief
     OD-B14-S04 — quick reader of the tale giving warmth
   Built on the engine hero rig: bespoke poses register additively onto the
   shared POSES table; a hide shoulder-mantle + herdsman's staff are drawn in
   solid grays + hard contour so the engine's dotify POST pass supplies the
   halftone, matching the reference EUMAEUS swineherd card. */
import { makeFigure, INK, gray } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

const params = {
  // weathered ruddy working skin; grizzled grey-brown hair + full beard so he
  // reads middle-aged-to-older and rugged, distinct from the dark-curled king.
  skin:"#c6a37c", hairColor:"#6d6459",
  hair:"short", beard:true, glasses:false,
  garment:"tunic", cloak:true, bareLegs:true, scale:1.02,
};

const fig = makeFigure(params);

/* ---- bespoke swineherd poses ----
   The rig reads brow/frown/jaw/arm channels straight off the pose def, so each
   characterful beat gets its own registered pose. A herdsman's planted-weight
   sturdiness (a touch of shoulderLift + a firm stance) is baked in. */
function P(id, n, hands){ POSES[id] = { id, label:id, group:"eumaeus", n, opt:hands?{hands}:{} }; }

// WELCOME — the signature: the sturdy host swings both arms open in an
// open-handed welcome, chest broadened, the near hand offered forward, weathered
// face warmed by a kind smile and lifted brows. Hospitality itself.
P("eum_welcome", {
  chestOpen:.72, spineLean:-.06,
  armLUpper:.88, armLLower:-.34, handRotL:-.2,          // far arm swept open
  armRUpper:-1.04, armRLower:.5, handRotR:.16,          // near hand offered forward
  shoulderLiftL:.12, shoulderLiftR:.12,
  smile:.42, browUp:.34, browKnit:.06, cheek:.3, headRoll:.04,
}, ["open_palm","offering"]);

// WARD — the protective beat that opens Book 14: he squares up, near arm cocked
// up and back with a stone to hurl, far arm thrown forward to fend off, brows
// slammed down, eyes pinched, mouth hard. A herdsman defending his beasts.
P("eum_ward", {
  spineLean:-.12, bodyYaw:-.14, rootScale:1.04,
  armRUpper:-2.58, armRLower:.28, handRotR:.1,          // near arm cocked overhead — the throw
  armLUpper:1.18, armLLower:-.86, handRotL:-.1,          // far arm forward, warding
  shoulderLiftR:.5, shoulderLiftL:.2,
  browKnit:.66, eyeNarrow:.32, frown:.34, jaw:.1,
}, ["fist","stop"]);

// SPEAK — the loyal servant pouring out grief and anger at once: leaning in,
// near arm flung out in complaint, jaw parted on a hard word, brows knit-and-up,
// a downturned mouth. The bitterness of a good man wronged.
P("eum_speak", {
  spineLean:-.16, chestOpen:.3,
  armRUpper:-1.32, armRLower:.34, handRotR:.14,
  armLUpper:.42, armLLower:-.5,
  browKnit:.5, browUp:.34, frown:.34, jaw:.44, eyeNarrow:.12, mouthAsym:.2,
}, ["relaxed","open_palm"]);

// LISTEN — absorbed, compassionate: bowed a little toward the tale, weight
// settled onto the staff, hands drawn in, brows lifted-and-knit into open pity,
// gaze steady and soft. The great listener of the poem.
P("eum_listen", {
  spineLean:-.24, headPitch:.16, neckPitch:.1, headY:.06,
  armLUpper:.22, armLLower:-.44, handRotL:-.16,          // steadying hand low on the staff
  armRUpper:-.36, armRLower:.92, handRotR:.12,           // near hand drawn in, resting
  shoulderLiftL:.2, shoulderLiftR:.24,
  browUp:.5, browKnit:.42, frown:.16, eyeNarrow:.06,
}, ["relaxed","relaxed"]);

// SKEPTIC — the one firm boundary: he will not believe the stranger's promise of
// the master's return. Torso turns off, head cocks, one brow climbs while the
// other knits, eyes narrow, mouth skews, the near forearm lifts in a level
// "no — I've heard that before" check. Disbelief, but without cruelty.
P("eum_skeptic", {
  bodyYaw:.16, headYaw:-.16, headRoll:-.2, spineLean:.1,
  armRUpper:.34, armRLower:1.4, handRotR:-.14,           // near forearm up, palm checking
  armLUpper:.28, armLLower:-.42,
  browUp:.2, browKnit:.42, eyeNarrow:.42, mouthAsym:.62, frown:.12,
}, ["relaxed","stop"]);

// GRIEVE — the kindly grieving loyalty under everything: head bowed, gaze cast
// low, shoulders sunk, the near hand fallen open, brows up-and-knit over a heavy
// frown. Mourning a master he believes long dead.
P("eum_grieve", {
  spineLean:.12, headPitch:.42, neckPitch:.22, headY:.14, headRoll:.06,
  gazeY:.42, shoulderLiftL:.16,
  armRUpper:.16, armRLower:.62, handRotR:.1,
  armLUpper:.22, armLLower:-.46, handRotL:-.14,          // steadying on the staff
  browUp:.66, browKnit:.5, frown:.5, eyeNarrow:.22,
}, ["relaxed","relaxed"]);

/* ---- HERDSMAN'S STAFF ----
   A tall, worn staff planted at his left side that he leans his working weight
   into. Drawn BEFORE the figure so the body and the steadying left hand overlap
   it. Solid grays + hard contour -> the engine halftones it with the figure. */
function drawStaff(ctx, W, H){
  const gx   = W*0.335;             // planted at the left, under the steadying hand
  const topY = H*0.400;             // rises to about shoulder height
  const footY= H*0.945;
  const lean = W*0.018;
  ctx.save(); ctx.lineCap="round"; ctx.lineJoin="round";
  // hard contour underlay
  ctx.strokeStyle=INK; ctx.lineWidth=W*0.036;
  ctx.beginPath(); ctx.moveTo(gx,topY); ctx.lineTo(gx+lean,footY); ctx.stroke();
  // weathered wood core (mid grey)
  ctx.strokeStyle=gray(0x6a); ctx.lineWidth=W*0.021;
  ctx.beginPath(); ctx.moveTo(gx,topY); ctx.lineTo(gx+lean,footY); ctx.stroke();
  // a couple of knots down the shaft
  ctx.fillStyle=gray(0x4d); ctx.strokeStyle=INK; ctx.lineWidth=W*0.008;
  for (const f of [0.36,0.68]){
    const ky=topY+(footY-topY)*f, kx=gx+lean*f;
    ctx.beginPath(); ctx.ellipse(kx,ky,W*0.019,W*0.028,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
  }
  // worn crook/knob at the top
  ctx.fillStyle=gray(0x6a); ctx.strokeStyle=INK; ctx.lineWidth=W*0.01;
  ctx.beginPath(); ctx.arc(gx,topY,W*0.03,0,Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.restore();
}

/* ---- HEAVY HIDE CLOAK (shoulder-mantle) ----
   A rough hide mantle yoked across the shoulders as short capelet flaps over
   each shoulder cap, with a ragged fur-tick lower edge — the swineherd's
   defining winter garment. Drawn AFTER the figure using the rig's reported
   neck/hip anchors, but kept LOW on the shoulders (well clear of the beard) and
   in a mid grey so the weathered face, the tunic + belt, and the expressive
   open hands all still read. */
function drawHideCloak(ctx, W, H, neck, hip){
  const nx = neck.x*W;
  const ny = neck.y*H;
  const hy = hip.y*H;
  const shY   = ny + (hy-ny)*0.14;          // capelet sits ON the shoulders, below the throat
  const sw    = W*0.165;                     // outer shoulder reach of the mantle
  const dropY = ny + (hy-ny)*0.62;           // flaps fall to mid-torso only
  ctx.save(); ctx.lineJoin="round"; ctx.lineCap="round";

  // one hide flap per shoulder, mirrored — a short heavy capelet over the cap
  ctx.fillStyle=gray(0x76); ctx.strokeStyle=INK; ctx.lineWidth=4;
  for (const s of [-1,1]){
    ctx.beginPath();
    ctx.moveTo(nx + s*sw*0.22, shY - H*0.006);          // inner top, at the collar
    ctx.quadraticCurveTo(nx + s*sw*1.06, shY - H*0.006, nx + s*sw*1.04, shY + H*0.06); // over the shoulder cap
    ctx.quadraticCurveTo(nx + s*sw*1.10, dropY - H*0.02, nx + s*sw*0.86, dropY);        // outer edge falling
    ctx.quadraticCurveTo(nx + s*sw*0.56, dropY + H*0.012, nx + s*sw*0.34, dropY - H*0.02); // ragged hem
    ctx.quadraticCurveTo(nx + s*sw*0.24, shY + H*0.10, nx + s*sw*0.20, shY + H*0.02);   // inner edge back up
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }

  // collar band across the shoulders — a rolled hide yoke tying the flaps
  ctx.fillStyle=gray(0x5c); ctx.strokeStyle=INK; ctx.lineWidth=4;
  ctx.beginPath();
  ctx.moveTo(nx - sw*0.40, shY + H*0.006);
  ctx.quadraticCurveTo(nx - sw*0.26, shY - H*0.026, nx, shY - H*0.022);
  ctx.quadraticCurveTo(nx + sw*0.26, shY - H*0.026, nx + sw*0.40, shY + H*0.006);
  ctx.quadraticCurveTo(nx + sw*0.26, shY + H*0.030, nx, shY + H*0.026);
  ctx.quadraticCurveTo(nx - sw*0.26, shY + H*0.030, nx - sw*0.40, shY + H*0.006);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // a bone/thorn pin fastening the collar at the throat
  ctx.fillStyle=gray(0xd2); ctx.strokeStyle=INK; ctx.lineWidth=3;
  ctx.beginPath(); ctx.ellipse(nx, shY + H*0.004, W*0.013, W*0.019, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();

  // ragged fur ticks along the two hem edges — the "heavy hide" read
  ctx.strokeStyle=INK; ctx.lineWidth=2.4; ctx.lineCap="round";
  for (const s of [-1,1]){
    for (let i=0;i<6;i++){
      const t=i/5, ex=nx + s*(sw*0.34 + (sw*0.54)*t), ey=dropY - H*0.014 + H*0.02*Math.sin(t*3);
      ctx.beginPath(); ctx.moveTo(ex,ey); ctx.lineTo(ex + s*W*0.005, ey + H*0.016); ctx.stroke();
    }
    // a long vertical hide crease down each flap
    ctx.lineWidth=2.6;
    ctx.beginPath();
    ctx.moveTo(nx + s*sw*0.60, shY + H*0.05);
    ctx.quadraticCurveTo(nx + s*sw*0.78, ny + H*0.12, nx + s*sw*0.66, dropY - H*0.02);
    ctx.stroke();
  }
  ctx.restore();
}

export const asset = {
  id:"character.eumaeus",
  type:"CHARACTER",
  name:"Eumaeus",
  statusWord:"LOYAL",
  scene:"OD-B14-S01",

  params,
  layers:["shadow","staff","hair-back","legs","tunic","far-arm","neck","head","face","beard","near-arm","hide-cloak"],
  // normalized 0..1 anchors for scene attachment / gaze / staging
  anchors:{
    head:{x:.50,y:.22}, crown:{x:.50,y:.14}, eyes:{x:.50,y:.23},
    rightHand:{x:.66,y:.58}, leftHand:{x:.36,y:.56},
    staffGrip:{x:.34,y:.50}, staffFoot:{x:.35,y:.94},
    cloakPin:{x:.50,y:.42}, hip:{x:.50,y:.64}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"welcoming",
    nodes:{
      // SIGNATURE — the open-handed host: both arms swung open, near hand
      // offered forward, weathered face warmed by a kind smile and lifted brows.
      welcoming:{ preview:{ pose:"eum_welcome", smile:.42, browUp:.34, browKnit:.06,
                            cheek:.3, gaze:{x:.06,y:-.02}, t:0.5 } },
      // OD-B14-S01 open — WARD: stone cocked overhead, far arm out to fend off,
      // brows slammed, eyes pinched, mouth hard. The protective herdsman.
      warding:  { preview:{ pose:"eum_ward", browKnit:.66, eyeNarrow:.32, frown:.34,
                            jaw:.1, gaze:{x:-.4,y:-.06}, t:0.5 } },
      // OD-B14-S02 — SPEAKING grief-and-anger: leaning in, near arm flung out,
      // jaw parted on a hard word, brows knit-and-up over a downturned mouth.
      speaking: { preview:{ pose:"eum_speak", browKnit:.5, browUp:.34, frown:.34,
                            jaw:.44, eyeNarrow:.12, mouthAsym:.2,
                            gaze:{x:.14,y:.02}, t:0.5 } },
      // OD-B14-S03/S04 — LISTENING: bowed toward the tale, hands drawn in, brows
      // lifted-and-knit into open compassion, gaze steady and soft.
      listening:{ preview:{ pose:"eum_listen", browUp:.5, browKnit:.42, frown:.16,
                            eyeNarrow:.06, gaze:{x:.08,y:.14}, t:0.5 } },
      // OD-B14-S03 boundary — SKEPTICAL: torso off, head cocked, one brow up one
      // knit, eyes narrowed, mouth skewed, forearm up in a level check. Disbelief.
      skeptical:{ preview:{ pose:"eum_skeptic", browUp:.2, browKnit:.42, eyeNarrow:.42,
                            mouthAsym:.62, frown:.12, gaze:{x:-.5,y:.02}, t:0.42 } },
      // GRIEVING loyalty — head bowed, gaze low, hand fallen open, deep grief brows.
      grieving: { preview:{ pose:"eum_grieve", browUp:.66, browKnit:.5, frown:.5,
                            eyeNarrow:.22, gaze:{x:.02,y:.44}, t:0.5 } },
    },
    edges:[["welcoming","warding"],["warding","welcoming"],["welcoming","speaking"],
           ["speaking","listening"],["listening","skeptical"],["skeptical","listening"],
           ["listening","grieving"],["grieving","welcoming"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym","cheek"],

  // CARD SIGNATURE — LOYAL: the sturdy weathered swineherd in his heavy hide
  // cloak, leaning by his staff, throwing both arms open in a warm, kind-faced,
  // open-handed welcome — the hospitality that defines him.
  preview:()=>({ pose:"eum_welcome", smile:.42, browUp:.34, browKnit:.06, cheek:.3,
                 gaze:{x:.06,y:-.02}, t:0.5, status:"LOYAL", progress:.2 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    // herdsman's staff planted behind the body (steadying hand overlaps it)
    drawStaff(ctx, W, H);
    // the articulated swineherd
    const r = fig.draw(ctx, W, H, st);
    // heavy hide shoulder-cloak, tracking the rig's neck + hip anchors
    const neck = (r && r.anchors && r.anchors.neck) || { x:0.5, y:0.42 };
    const hip  = (r && r.anchors && r.anchors.hip)  || { x:0.5, y:0.64 };
    drawHideCloak(ctx, W, H, neck, hip);
    return r;
  },
};
export default asset;
