/* character.ino-leucothea — the compassionate sea-goddess who saves the drowning Odysseus.
   CHARACTER asset. Once the mortal Ino, now the immortal Leucothea ("White
   Goddess") of the salt sea. She rises to the wrecked raft first as a sea-bird
   (a gannet / shearwater alighting on the timbers) and unfolds into a woman:
   a wet, clinging sea-robe, a veil over her hair, and — held out in urgent
   compassion — the KREDEMNON, the immortal veil she gives him to bind under
   his chest so the water cannot drown him.

   Scene function:
     OD-B05-S05 — sea-bird arrival transforming into a compassionate marine
                  goddess offering survival instructions (give up the raft,
                  bind on the veil, strike out swimming for the Phaeacian shore).

   Built on the engine hero rig (garment:"dress") with custom solid-gray layers
   so the engine's dotify POST pass supplies the halftone:
     · hinted SEA-BIRD WINGS sweeping up behind the shoulders (her arriving form)
     · a long translucent VEIL/sea-robe drape trailing behind her
     · a WET SEA-ROBE skirt with a wave-scalloped hem drawn over the rig legs
     · the OFFERED VEIL (kredemnon) — a rippling cloth attached to her actual
       offering hand (read from the rig's returned anchor), her giving gesture
   The signature beats need brow/jaw/reach combos the base poses don't carry, so
   they are registered as bespoke poses on the shared POSES table. */
import { makeFigure, INK, gray, shade } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

const params = {
  skin:"#e7ddca", hairColor:"#2a251d",
  hair:"long", beard:false, glasses:false,
  garment:"dress", cloak:false, bareLegs:false, scale:1.0,
};

const fig = makeFigure(params);

/* ---- bespoke poses for Ino-Leucothea's beats ----
   composeStatic reads brow/jaw/frown ONLY from the pose def, but the asset also
   overlays explicit facial channels from the state; poses here fix the ARM +
   torso geometry of each beat, the state adds the mood. POSES is a shared module
   singleton, so registering here makes these ids resolvable by the rig. */
function P(id, n, hands){ POSES[id] = { id, label:id, group:"ino", n, opt:hands?{hands}:{} }; }

// SIGNATURE — GIVING THE VEIL: the near (right) arm reaches forward and low to
// press the kredemnon into the drowning man's hands; the far hand steadies at
// her breast; torso half-open and inclined toward him; a kind, urgent face.
P("ino_offer_veil", {
  bodyYaw:-.20, headYaw:-.16, spineLean:-.16, chestOpen:.30,
  armRUpper:-1.02, armRLower:.56, handRotR:.18,          // near hand out & down with the veil
  armLUpper:-.14, armLLower:-.92, handRotL:.24, shoulderLiftL:.16, // far hand rests at the heart
  headPitch:.10, headY:.04, gazeX:-.14,
}, ["relaxed","offering"]);

// ARRIVING — the sea-bird alights and unfolds into a woman: both arms lifted
// and thrown wide like settling wings, chin up, an alert bright face.
P("ino_arrive", {
  chestOpen:.7, spineLean:-.06,
  armLUpper:1.92, armLLower:-.34, handRotL:-.2, shoulderLiftL:.6,
  armRUpper:-1.92, armRLower:.34, handRotR:.2, shoulderLiftR:.6,
  headY:-.08, headYaw:.05,
}, ["open_palm","open_palm"]);

// URGING — she leans in over him and drives the counsel home: the near hand
// thrust forward, torso open, mouth parted on the command, brows lifted urgent.
P("ino_urge", {
  bodyYaw:-.14, headYaw:-.18, spineLean:-.34, chestOpen:.4,
  armRUpper:-1.24, armRLower:.42, handRotR:.14,
  armLUpper:.30, armLLower:-.36, handRotL:-.1,
  headPitch:.06, gazeX:-.16,
}, ["relaxed","offering"]);

/* Hinted SEA-BIRD WINGS — two swept wing shapes rising from behind the
   shoulders with a scalloped feather trailing edge. Kept LIGHT (near paper) so
   the dotify pass renders them as a soft scatter behind the hard figure contour,
   never competing with it — a ghost of the bird she just was. Drawn FIRST. */
function drawWings(ctx, W, H){
  const cx = W*0.50, shY = H*0.395;
  ctx.save();
  ctx.lineJoin = "round";
  for (const s of [-1, 1]){
    // wing membrane
    ctx.fillStyle = gray(0xd6); ctx.strokeStyle = gray(0xa6); ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx + s*W*0.055, shY);
    ctx.quadraticCurveTo(cx + s*W*0.24, H*0.235, cx + s*W*0.345, H*0.215);  // leading edge to tip
    // scalloped feather trailing edge back down toward the shoulder
    const tipX = cx + s*W*0.345, tipY = H*0.215;
    const rootX = cx + s*W*0.105, rootY = H*0.520;
    const N = 4;
    let px = tipX, py = tipY;
    for (let i=1;i<=N;i++){
      const t = i/N;
      const bx = tipX + (rootX-tipX)*t, by = tipY + (rootY-tipY)*t;
      const nx = -(rootY-tipY), ny = (rootX-tipX);            // normal for the scallop bulge
      const nl = Math.hypot(nx,ny)||1;
      const bulge = W*0.028;
      const mx = (px+bx)/2 + (nx/nl)*bulge, my = (py+by)/2 + (ny/nl)*bulge;
      ctx.quadraticCurveTo(mx, my, bx, by);
      px = bx; py = by;
    }
    ctx.quadraticCurveTo(cx + s*W*0.04, H*0.46, cx + s*W*0.055, shY);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // a few feather-shaft seams
    ctx.strokeStyle = gray(0xb2); ctx.lineWidth = 2;
    for (let i=1;i<=3;i++){
      const t = i/4.2;
      ctx.beginPath();
      ctx.moveTo(cx + s*W*(0.06+0.02*i), shY - H*0.005*i);
      ctx.quadraticCurveTo(cx + s*W*0.20, H*(0.27+0.03*i), cx + s*W*(0.30-0.03*i), H*(0.24+0.05*i));
      ctx.stroke();
    }
  }
  ctx.restore();
}

/* Long translucent VEIL / sea-robe drape trailing BEHIND her — a soft immortal
   cloth falling from the crown past the shoulders, its lower edge broken into
   sea-wave scallops (she is wet, risen from the swell). Light gray so the dotify
   pass weaves it. Drawn BEFORE the figure (behind it). */
function drawBackVeil(ctx, W, H){
  const cx = W*0.50, crownY = H*0.125, dropY = H*0.640;
  ctx.fillStyle = gray(0xd0); ctx.strokeStyle = gray(0x9c); ctx.lineWidth = 3.5; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - W*0.190, crownY + H*0.060);
  ctx.quadraticCurveTo(cx - W*0.250, H*0.36, cx - W*0.185, dropY);
  // wave-scalloped hem across the bottom
  const N = 6, x0 = cx - W*0.185, x1 = cx + W*0.185;
  for (let i=1;i<=N;i++){
    const t = i/N, bx = x0 + (x1-x0)*t;
    const dip = (i%2===0) ? dropY + H*0.028 : dropY - H*0.006;
    const mx = x0 + (x1-x0)*(t-0.5/N);
    ctx.quadraticCurveTo(mx, dip, bx, dropY - H*0.004 + (i%2)*H*0.012);
  }
  ctx.quadraticCurveTo(cx + W*0.250, H*0.36, cx + W*0.190, crownY + H*0.060);
  ctx.quadraticCurveTo(cx, crownY - H*0.045, cx - W*0.190, crownY + H*0.060);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // soft fold seams so it reads as flowing cloth, not a slab
  ctx.strokeStyle = gray(0x9c); ctx.lineWidth = 2;
  for (const s of [-1, 1]){
    ctx.beginPath();
    ctx.moveTo(cx + s*W*0.120, crownY + H*0.03);
    ctx.quadraticCurveTo(cx + s*W*0.200, H*0.37, cx + s*W*0.130, dropY - H*0.03);
    ctx.stroke();
  }
}

/* WET SEA-ROBE skirt — a clinging gown from a high waist to the ankles, drawn
   OVER the rig legs so she reads as robed. The hem breaks into sea-wave
   scallops; the folds cling close (wet cloth) rather than flaring. */
function drawSeaRobe(ctx, W, H){
  const cx = W*0.50, waistY = H*0.600, hemY = H*0.900;
  const wTop = W*0.078, wHem = W*0.150;
  ctx.fillStyle = gray(0x82); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY);
  ctx.quadraticCurveTo(cx - wHem*0.86, H*0.79, cx - wHem, hemY);
  // wave-scalloped hem
  const N = 5, x0 = cx - wHem, x1 = cx + wHem;
  for (let i=1;i<=N;i++){
    const t = i/N, bx = x0 + (x1-x0)*t;
    const crest = (i%2===0) ? hemY + H*0.024 : hemY - H*0.010;
    const mx = x0 + (x1-x0)*(t-0.5/N);
    ctx.quadraticCurveTo(mx, crest, bx, hemY + (i%2)*H*0.010);
  }
  ctx.quadraticCurveTo(cx + wHem*0.86, H*0.79, cx + wTop, waistY);
  ctx.quadraticCurveTo(cx, waistY + H*0.010, cx - wTop, waistY);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // clinging vertical folds
  ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.lineCap = "round";
  for (let i=-2;i<=2;i++){
    const tx = i/2.2;
    ctx.beginPath();
    ctx.moveTo(cx + tx*wTop, waistY + H*0.012);
    ctx.quadraticCurveTo(cx + tx*wHem*0.9, H*0.80, cx + tx*wHem*0.98, hemY - H*0.02);
    ctx.stroke();
  }
  // high waist sash
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY + H*0.004);
  ctx.quadraticCurveTo(cx, waistY + H*0.018, cx + wTop, waistY + H*0.004);
  ctx.stroke();
}

/* The OFFERED VEIL — the kredemnon, a rippling immortal cloth held out from her
   offering hand. Positioned from the rig's ACTUAL returned hand anchor so it
   tracks whatever pose is active, then billows down and outward with a wavy
   lower edge. Mid gray so it reads as a distinct cloth over the pale wing/veil
   backdrop but lighter than the robe. Drawn LAST (over the near arm). */
function drawOfferedVeil(ctx, W, H, hand){
  if (!hand) return;
  const hx = hand.x*W, hy = hand.y*H;
  const outw = (hand.x < 0.5 ? -1 : 1);   // billow toward the near frame edge
  ctx.save();
  ctx.fillStyle = gray(0xb0); ctx.strokeStyle = gray(0x6c); ctx.lineWidth = 3.2; ctx.lineJoin = "round";
  const topW = W*0.060, len = H*0.235, drift = outw*W*0.045;
  ctx.beginPath();
  ctx.moveTo(hx - topW, hy - H*0.012);
  ctx.quadraticCurveTo(hx + topW*0.6, hy + H*0.006, hx + topW, hy + H*0.004);
  // outer falling edge, rippling out and down
  ctx.quadraticCurveTo(hx + topW*1.4 + drift*0.5, hy + len*0.42, hx + drift, hy + len);
  // wavy lower hem back across
  ctx.quadraticCurveTo(hx - topW*0.4 + drift*0.5, hy + len*0.86, hx - topW*0.9 + drift*0.4, hy + len*0.66);
  ctx.quadraticCurveTo(hx - topW*1.5, hy + len*0.5, hx - topW*1.15, hy + len*0.22);
  // inner falling edge back to the hand
  ctx.quadraticCurveTo(hx - topW*1.3, hy + H*0.02, hx - topW, hy - H*0.012);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // ripple fold lines
  ctx.strokeStyle = gray(0x74); ctx.lineWidth = 1.8; ctx.lineCap = "round";
  for (let i=1;i<=3;i++){
    const t = i/4;
    ctx.beginPath();
    ctx.moveTo(hx - topW*0.8 + t*topW*1.2, hy + H*0.006);
    ctx.quadraticCurveTo(hx + drift*0.5, hy + len*(0.4+0.15*i), hx - topW*0.6 + drift*0.5, hy + len*(0.6+0.1*i));
    ctx.stroke();
  }
  ctx.restore();
}

export const asset = {
  id:"character.ino-leucothea",
  type:"CHARACTER",
  name:"Ino-Leucothea",
  statusWord:"MERCIFUL",
  scene:"OD-B05-S05",

  params,
  layers:["wings","back-veil","legs","dress","far-arm","neck","head","face",
          "hair-front","near-arm","sea-robe","offered-veil"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.11}, eyes:{x:.50,y:.20},
    rightHand:{x:.66,y:.62}, leftHand:{x:.40,y:.52},
    veilGrip:{x:.66,y:.62}, wingTip:{x:.83,y:.24},
    hip:{x:.50,y:.64}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"offering",
    nodes:{
      // SIGNATURE — OD-B05-S05: pressing the veil into his hands, kind + urgent
      offering:  { preview:{ pose:"ino_offer_veil", smile:.12, browUp:.5,
                             browKnit:.16, eyeWide:.26, jaw:.18,
                             gaze:{x:-.14,y:.18}, t:0.45 } },
      // OD-B05-S05: the sea-bird alights and unfolds — wings thrown wide, bright
      arriving:  { preview:{ pose:"ino_arrive", smile:.18, browUp:.32,
                             eyeWide:.36, jaw:.12, gaze:{x:.06,y:-.04}, t:0.5 } },
      // OD-B05-S05: driving the survival counsel home — mouth open, urgent
      urging:    { preview:{ pose:"ino_urge", jaw:.5, smile:.1, browUp:.44,
                             browKnit:.12, eyeWide:.24, gaze:{x:-.16,y:.08},
                             t:0.5 } },
      // OD-B05-S05: pure compassion — she inclines over the drowning man, brows
      // knit-and-lift with pity, gaze cast down to him, mouth soft
      compassion:{ preview:{ pose:"lean_forward", frown:.2, browUp:.44,
                             browKnit:.34, eyeNarrow:.12, smile:.06,
                             gaze:{x:-.06,y:.34}, t:0.5 } },
    },
    edges:[["arriving","offering"],["offering","urging"],["urging","offering"],
           ["offering","compassion"],["compassion","offering"],
           ["arriving","urging"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — MERCIFUL: the goddess holds out the immortal veil, far hand
  // pressed to her heart, brows lifted in urgent compassion, eyes a little wide,
  // mouth just parted on the counsel, gaze cast down to the man in the water —
  // hinted sea-bird wings still open behind her.
  preview:()=>({ pose:"ino_offer_veil",
                 smile:.12, browUp:.5, browKnit:.16, eyeWide:.26, jaw:.18,
                 gaze:{x:-.14,y:.18}, t:0.45, status:"MERCIFUL", progress:.22 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    // her arriving/bird form and trailing veil sit behind the figure
    drawWings(ctx, W, H);
    drawBackVeil(ctx, W, H);
    const r = fig.draw(ctx, W, H, st);
    // wet sea-robe over the legs, then the offered veil on her actual hand
    drawSeaRobe(ctx, W, H);
    const hand = (r && r.anchors && r.anchors.rightHand) ? r.anchors.rightHand : null;
    drawOfferedVeil(ctx, W, H, hand);
    return r;
  },
};
export default asset;
