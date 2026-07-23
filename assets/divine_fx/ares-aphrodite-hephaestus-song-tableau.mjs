/* divine_fx.ares-aphrodite-hephaestus-song-tableau — the bard Demodokos'
   comic myth, staged as one procedural vignette. DIVINE_FX. Scene function
   (OD-B08-S04): Ares and Aphrodite lie together on a bed; Hephaestus'
   invisible chains — a fine unbreakable NET (diamond mesh) — drop and cinch
   shut around the two lover-figures; the other gods ARRIVE at the sides and
   stand LAUGHING at the trapped pair; then the net LIFTS and the lovers are
   RELEASED. Faint tableau silhouettes + net mesh; the whole thing plays over
   state.t through source -> field -> transform states.

   Procedural over state.t (or explicit drop / godsIn / laugh channels):
     SOURCE   (net snaps down, invisible chains springing shut; gods gathering)
     FIELD    (net taut over the bed, lovers ensnared, gods laughing at the sides)
     TRANSFORM(the net lifts, the mesh peels off, the lovers released)
   Solid grays + hard contour only; the engine POST pass supplies the halftone —
   do NOT pre-dither. Engine primitives only. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const frac = x => x - Math.floor(x);
const clamp01 = x => clamp(x,0,1);

const params = {
  period:   7.5,     // seconds for source -> field -> transform to cycle
  bedCX:    0.500,   // bed centre x, frac of W
  bedTopY:  0.620,   // mattress top surface y, frac of H
  bedW:     0.520,   // mattress width, frac of W
  bedH:     0.070,   // mattress slab thickness, frac of H
  groundY:  0.905,   // floor line the arriving gods stand on, frac of H
  netCols:  15,      // diamond-lattice density across the bed
  godL:     0.140,   // resting x of the left arriving god, frac of W
  godR:     0.860,   // resting x of the right arriving god, frac of W
};

/* ---- a reclining lover-figure lying along the mattress. Local unit = body
   length `len`; origin (cx, sy) is the mattress surface midpoint. dir flips
   which end the head is on. `sit` (0..1) raises the torso when released. ---- */
function reclineFig(pen, g, cx, sy, len, tone, dir, sit, lw){
  const hipx = cx - dir*len*0.34;
  const hipy = sy - len*0.05;
  const chx  = cx + dir*len*0.10;                     // chest
  const chy  = sy - len*(0.07 + 0.20*sit);
  const hx   = cx + dir*len*(0.32 + 0.05*sit);        // head
  const hy   = sy - len*(0.10 + 0.34*sit);
  const hr   = len*0.115;
  // far leg (behind), then near leg — trailing off the hip toward the foot end
  pen.limb(()=>{ g.moveTo(hipx,hipy); g.lineTo(cx-dir*len*0.52, sy-len*0.02); g.lineTo(cx-dir*len*0.66, sy); }, tone, lw*0.9);
  pen.limb(()=>{ g.moveTo(hipx,hipy); g.lineTo(cx-dir*len*0.50, sy-len*0.10); g.lineTo(cx-dir*len*0.62, sy-len*0.02); }, tone, lw*0.95);
  // torso (hip -> chest)
  pen.limb(()=>{ g.moveTo(hipx,hipy); g.lineTo(chx,chy); }, tone, lw*1.5);
  // near arm reaching across
  pen.limb(()=>{ g.moveTo(chx,chy); g.lineTo(cx-dir*len*0.02, sy-len*(0.02+0.10*sit)); }, tone, lw*0.8);
  // neck + head
  pen.limb(()=>{ g.moveTo(chx,chy); g.lineTo(hx,hy); }, tone, lw*0.7);
  pen.paint(()=>{ g.arc(hx,hy,hr,0,TAU); }, tone, 4);
}

/* ---- the marriage bed: mattress slab + four turned legs + a headboard. ---- */
function drawBed(pen, g, W, H){
  const cx=W*params.bedCX, sy=H*params.bedTopY, bw=W*params.bedW, bh=H*params.bedH;
  const x0=cx-bw/2, x1=cx+bw/2;
  // headboard (left end)
  pen.paint(()=>{ g.rect(x0-bw*0.05, sy-bh*3.0, bw*0.075, bh*3.0); }, toneSolid(inkLevel(5)), 4);
  pen.paint(()=>{ g.rect(x1-bw*0.02, sy-bh*1.8, bw*0.06, bh*1.8); }, toneSolid(inkLevel(5)), 4); // footboard
  // mattress slab
  pen.paint(()=>{ g.rect(x0, sy, bw, bh); }, toneSolid(inkLevel(3)), 5);
  // a coverlet lip
  pen.paint(()=>{ g.rect(x0, sy+bh*0.72, bw, bh*0.42); }, toneSolid(inkLevel(3)), 3);
  // four legs
  const legH=bh*2.2, legW=bw*0.045;
  [x0+legW, x1-legW*2, cx-legW/2].forEach(lx=>{
    pen.paint(()=>{ g.rect(lx, sy+bh, legW, legH); }, toneSolid(inkLevel(5)), 3);
  });
}

/* ---- the fine invisible net: a diamond lattice draped over the bed. Slides
   down (drop->1) to cinch the lovers, lifts (drop->0) to release. `taut`
   darkens the mesh + closes a containing hoop when the trap is sprung. ---- */
function drawNet(pen, g, W, H, drop, taut){
  const cx=W*params.bedCX, bw=W*params.bedW;
  const x0=cx-bw*0.56, x1=cx+bw*0.56;
  const surf=H*params.bedTopY;
  // net spans a panel that travels vertically with `drop`
  const yTop=lerp(H*0.075, H*0.315, drop);
  const yBot=lerp(H*0.300, surf+H*0.010, drop);
  const boxH=yBot-yTop, cell=boxH/4.6;
  const sag = H*0.020*taut;                        // slight downward bow when draped

  g.save();
  g.beginPath(); g.rect(x0-6, yTop-6, (x1-x0)+12, boxH+12); g.clip();
  g.strokeStyle=INK; g.lineCap="round";
  g.globalAlpha = lerp(0.30, 0.85, taut);
  g.lineWidth = lerp(0.9, 1.5, taut);
  // two diagonal families -> diamond mesh; clip trims them to the panel
  for(let sx=x0-boxH; sx<=x1+boxH; sx+=cell){
    g.beginPath(); g.moveTo(sx, yTop); g.quadraticCurveTo(sx+boxH*0.5+sag, yTop+boxH*0.5, sx+boxH, yBot); g.stroke();
    g.beginPath(); g.moveTo(sx, yTop); g.quadraticCurveTo(sx-boxH*0.5-sag, yTop+boxH*0.5, sx-boxH, yBot); g.stroke();
  }
  g.globalAlpha=1;
  g.restore();

  // containing hoop — the closed loop of chain around the trapped pair
  if (taut>0.35){
    g.save();
    g.strokeStyle=INK; g.lineWidth=lerp(1.5,3.0,taut); g.globalAlpha=clamp01(taut);
    g.beginPath(); g.ellipse(cx, lerp(surf-H*0.09, surf-H*0.11, taut), bw*0.60, boxH*0.62, 0, 0, TAU); g.stroke();
    g.globalAlpha=1; g.restore();
    // anchor tethers pinning the net to the four posts
    if (taut>0.7){
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.7;
      [-0.5,0.5].forEach(s=>{ g.beginPath(); g.moveTo(cx+s*bw*0.5, surf); g.lineTo(cx+s*bw*0.58, surf-H*0.02); g.stroke(); });
      g.globalAlpha=1;
    }
  }
}

/* ---- an arriving god at the side, standing and LAUGHING at the trapped pair.
   Blocky round-capped silhouette; head tips back and a hand slaps the thigh
   when `laugh` is high; laughter marks radiate above. dir faces the bed. ---- */
function godFig(pen, g, ox, gy, h, tone, dir, laugh, lw){
  const P=(lx,ly)=>({ x: ox + lx*h*dir, y: gy - ly*h });
  const back = laugh*0.10;                            // head tips back with the laugh
  const J = {
    hip:P(0,.46), sh:P(-.02-back,.80), neck:P(-.03-back,.865), head:P(-.05-back,.975), hr:h*.11,
    hipL:P(-.09,.46), hipR:P(.09,.46),
    kneeB:P(-.12,.23), footB:P(-.15,0),
    kneeF:P(.11,.23), footF:P(.16,0),
    // near arm: raised/pointing at the bed when laughing, else resting
    shA:P(.10,.80),
    elA: laugh>0.4 ? P(.32,.72) : P(.14,.62),
    wrA: laugh>0.4 ? P(.52,.66) : P(.16,.44),
    // far arm slaps the thigh
    shB:P(-.10,.80),
    elB: laugh>0.4 ? P(-.18,.60) : P(-.16,.62),
    wrB: laugh>0.4 ? P(-.10,.44) : P(-.17,.44),
  };
  const L=lw;
  pen.limb(()=>{ g.moveTo(J.hipL.x,J.hipL.y); g.lineTo(J.kneeB.x,J.kneeB.y); g.lineTo(J.footB.x,J.footB.y); }, tone, L*0.92);
  pen.limb(()=>{ g.moveTo(J.shB.x,J.shB.y); g.lineTo(J.elB.x,J.elB.y); g.lineTo(J.wrB.x,J.wrB.y); }, tone, L*0.72);
  pen.limb(()=>{ g.moveTo(J.hip.x,J.hip.y); g.lineTo(J.sh.x,J.sh.y); }, tone, L*1.5);
  pen.limb(()=>{ g.moveTo(J.hipR.x,J.hipR.y); g.lineTo(J.kneeF.x,J.kneeF.y); g.lineTo(J.footF.x,J.footF.y); }, tone, L*0.97);
  pen.limb(()=>{ g.moveTo(J.sh.x,J.sh.y); g.lineTo(J.neck.x,J.neck.y); }, tone, L*0.7);
  pen.paint(()=>{ g.arc(J.head.x,J.head.y,J.hr,0,TAU); }, tone, 4);
  pen.limb(()=>{ g.moveTo(J.shA.x,J.shA.y); g.lineTo(J.elA.x,J.elA.y); g.lineTo(J.wrA.x,J.wrA.y); }, tone, L*0.76);
  // laughter marks — small nested arcs above the head
  if (laugh>0.5){
    g.strokeStyle=INK; g.lineCap="round"; g.globalAlpha=clamp01((laugh-0.5)*2);
    for(let k=0;k<3;k++){
      const r=h*(0.10+k*0.07), a0=-2.5+dir*0.2;
      g.lineWidth=Math.max(2, h*0.02);
      g.beginPath(); g.arc(J.head.x - dir*h*0.02, J.head.y - h*0.14, r, a0, a0+1.5); g.stroke();
    }
    g.globalAlpha=1;
  }
}

function drawFX(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const t = st.t || 0;

  // drive drop / gods-arrival / laugh from t unless the caller overrides
  let drop = st.drop, godsIn = st.godsIn, laugh = st.laugh;
  if (drop === undefined){
    const ph = frac(t/params.period), seg = Math.min(2, Math.floor(ph*3)), loc = smooth(frac(ph*3));
    if (seg===0){ drop=loc;        godsIn=loc*0.7; laugh=0; }            // SOURCE: net snaps down, gods gathering
    else if (seg===1){ drop=1;     godsIn=1;       laugh=loc; }          // FIELD: taut, gods arrive & laugh
    else { drop=1-loc;             godsIn=1;       laugh=1-loc*0.3; }    // TRANSFORM: net lifts, release
  }
  drop=clamp01(drop); godsIn=clamp01(godsIn ?? 1); laugh=clamp01(laugh ?? 0);
  const taut = smooth(drop);

  const layers = st.layers || ["ground","bed","lovers","net","gods"];
  const has = l => layers.includes(l);

  // faint floor band
  if (has("ground")){
    g.fillStyle=inkLevel(1); g.fillRect(0, H*params.groundY, W, H*(1-params.groundY));
    pen.ink(()=>{ g.moveTo(0,H*params.groundY); g.lineTo(W,H*params.groundY); }, 2);
  }

  if (has("bed")) drawBed(pen, g, W, H);

  // the two lover-figures on the mattress (faint silhouettes). They sit up as
  // the net lifts (release) — sit rises as drop falls.
  if (has("lovers")){
    const cx=W*params.bedCX, surf=H*params.bedTopY, len=H*0.150;
    const sit=0.28+(1-drop)*0.4;                       // always some torso raise so heads read
    // heads point OUTWARD to opposite ends so the pair reads as two figures
    reclineFig(pen, g, cx-W*0.095, surf, len,      toneSolid(inkLevel(4)), -1, sit, len*0.085); // Aphrodite
    reclineFig(pen, g, cx+W*0.100, surf, len*0.96, toneSolid(inkLevel(5)),  1, sit, len*0.085); // Ares
  }

  if (has("net")) drawNet(pen, g, W, H, drop, taut);

  // arriving gods at the sides — slide in from off-frame as godsIn rises
  if (has("gods")){
    const gy=H*params.groundY, h=H*0.335;
    const lx=lerp(-W*0.14, W*params.godL, godsIn);
    const rx=lerp( W*1.14, W*params.godR, godsIn);
    godFig(pen, g, lx, gy, h, toneSolid(inkLevel(6)),  1, laugh, h*0.052);
    godFig(pen, g, rx, gy, h, toneSolid(inkLevel(6)), -1, laugh, h*0.052);
  }

  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"divine_fx.ares-aphrodite-hephaestus-song-tableau",
  type:"DIVINE_FX",
  name:"Ares-Aphrodite-Hephaestus song tableau",
  statusWord:"ENSNARED",
  scene:"OD-B08-S04",

  params,
  // back -> front; scene state may pass a subset (e.g. reveal net after gods)
  layers:["ground","bed","lovers","net","gods"],
  // normalized 0..1 anchors: the bed, the two lovers, the net, the arriving gods
  anchors:{
    "bed:center":{x:.50,y:.62},
    "lover:aphrodite":{x:.455,y:.60},
    "lover:ares":{x:.555,y:.60},
    "net:crown":{x:.50,y:.42},
    "god:left":{x:.14,y:.72},
    "god:right":{x:.86,y:.72},
    "arrival:left":{x:.02,y:.72},
    "arrival:right":{x:.98,y:.72},
    "camera:wide":{x:.50,y:.50},
    "camera:bed":{x:.50,y:.60},
  },
  // affected regions for scene placement / reveal
  zones:{
    bed:{ x0:.24,y0:.52,x1:.76,y1:.78 },
    net:{ x0:.20,y0:.30,x1:.80,y1:.64 },
    "gods-left":{ x0:.02,y0:.55,x1:.26,y1:.94 },
    "gods-right":{ x0:.74,y0:.55,x1:.98,y1:.94 },
  },

  // DIVINE_FX state machine: source (chains spring) -> field (trapped, mocked)
  //  -> transform (released). Also a neutral all-present tableau for the card.
  states:{
    initial:"tableau",
    nodes:{
      tableau:{ preview:{ drop:1, godsIn:1, laugh:0.9, status:"ENSNARED", progress:.5 } },
      source:{  preview:{ drop:0.45, godsIn:0.5, laugh:0, status:"SPRINGING", progress:.2 } },
      field:{   preview:{ drop:1, godsIn:1, laugh:1, status:"ENSNARED", progress:.55 } },
      transform:{ preview:{ drop:0.15, godsIn:1, laugh:0.4, status:"RELEASED", progress:.9 } },
    },
    edges:[["source","field"],["field","transform"],["transform","tableau"],
           ["tableau","source"],["tableau","field"]],
  },
  duration:7.5,
  channels:["t","drop","godsIn","laugh","reveal"],

  preview:()=>({ drop:1, godsIn:1, laugh:0.9, status:"ENSNARED", progress:.5,
                 layers:["ground","bed","lovers","net","gods"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
