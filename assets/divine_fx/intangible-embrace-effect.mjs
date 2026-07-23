/* divine_fx.intangible-embrace-effect — the shade that will not be held.
   DIVINE_FX asset. Scene function (OD-B11-S04): in the underworld the living
   reacher opens both arms to embrace a beloved shade (Anticleia); as the arms
   CLOSE the pale figure DISPERSES into rising wisps and the hands pass through
   empty air; as the arms OPEN again the shade REFORMS whole. It happens THREE
   times — three failed contact attempts — tallied by three attempt-markers.

   Procedural DIVINE_FX: SOURCE (a reaching living arm-pair rising from the
   foreground) -> TARGET (the pale standing shade) -> FIELD (the gloom lens the
   embrace happens inside) -> TRANSFORM (grasp k(t) closes the arms; the shade's
   materialization m(t) erodes upward into wisps as they close, then reforms as
   they open — the two are coupled, that coupling IS the effect) -> CONSEQUENCE
   (hands cross through nothing; the shade stands whole again; one more tally).

   Animates over state.t (one attempt cycle): 0 = arms wide, shade solid; ~0.42 =
   arms closing, shade half-dispersed into a column of wisps (neutral money-shot);
   ~0.6 = arms crossed through, shade nearly all wisp; 1 = arms open, shade whole.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. The living arms
   are the darkest, hardest shapes; the shade is pale with a crisp thin contour so
   she reads as a hole of light in the gloom; wisps are pale flecks rising off her. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  ground:    0.90,   // underworld floor line as frac of H
  shadeCX:   0.50,   // the shade's x
  shadeTop:  0.235,  // shade head-top as frac of H
  shadeHem:  0.680,  // shade robe hem as frac of H
  wisps:     24,     // rising dispersal flecks at full dispersal
  attempts:  3,      // total contact attempts (the three of the scene)
  intensity: 1.0,
};

/* ---- FIELD: the dim underworld the embrace happens inside. Kept LIGHT so the
   pale shade reads by her crisp contour and the dark smoke-wisps read against
   it; only a soft low gloom halo sits behind her for atmosphere. Flat tone steps
   only — no gradients. ---- */
function drawField(pen,g,W,H){
  const fy = H*params.ground;
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);                 // pale underworld haze
  // a soft modest gloom halo directly behind the shade (atmosphere, not a wall)
  const cx = params.shadeCX*W;
  g.fillStyle = inkLevel(2);
  g.beginPath(); g.ellipse(cx, H*0.42, W*0.20, H*0.30, 0,0,TAU); g.fill();
  // floor plane (a touch darker than the haze so the ground reads)
  g.fillStyle = inkLevel(3); g.fillRect(0,fy,W,H-fy);
  pen.ink(()=>{ g.moveTo(0,fy); g.lineTo(W,fy); }, 4);
  // a couple of receding floor joints
  g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.28;
  for(let j=1;j<=2;j++){ const y=fy+(H-fy)*(j/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha = 1;
}

/* ---- TARGET/TRANSFORM: the pale shade of the mother. Always drawn WHOLE (pale
   fill + crisp dark contour so she reads as a figure on the light haze), but her
   presence FADES with dispersal and her contour BREAKS into gaps as she comes
   apart — the substance she loses streams off as the wisps above. `m`
   (materialization 0..1) = 1-dispersal. Returns head + body metrics. ---- */
function drawShade(pen,g,W,H,m){
  const cx = params.shadeCX*W;
  const topY = H*params.shadeTop, hemY = H*params.shadeHem;
  const bodyH = hemY - topY;
  const headR = bodyH*0.135;
  const headCy = topY + headR;
  const shY = headCy + headR*1.7;
  const hipY = lerp(shY, hemY, 0.55);
  const shW = bodyH*0.30, hemW = bodyH*0.44;

  g.save();
  // presence: never fully invisible (she always faintly reforms), but clearly
  // ebbs as she disperses. The dark CONTOUR carries the silhouette; the pale
  // fill carries her body.
  g.globalAlpha = lerp(1, 0.42, 1-m);
  const robe = toneSolid(inkLevel(2));      // pale body against the light haze
  // broken contour as she comes apart: dashes open up with dispersal
  const setContour = ()=>{ const gap = (1-m); g.setLineDash(gap>0.15?[lerp(60,10,gap), lerp(3,14,gap)]:[]); };

  // ---- robe: shoulders flaring to the hem ----
  setContour();
  pen.paint(()=>{
    g.moveTo(cx-shW*0.5, shY);
    g.quadraticCurveTo(cx-shW*0.66, hipY, cx-hemW*0.5, hemY);
    g.quadraticCurveTo(cx, hemY+bodyH*0.02, cx+hemW*0.5, hemY);
    g.quadraticCurveTo(cx+shW*0.66, hipY, cx+shW*0.5, shY);
    g.quadraticCurveTo(cx, shY-bodyH*0.03, cx-shW*0.5, shY);
    g.closePath();
  }, robe, 3.5);
  g.setLineDash([]);
  // bright inner core
  pen.fillPath(()=>{
    g.moveTo(cx-shW*0.22, shY+bodyH*0.02);
    g.quadraticCurveTo(cx-shW*0.28, hipY, cx-hemW*0.22, hemY-4);
    g.lineTo(cx+hemW*0.22, hemY-4);
    g.quadraticCurveTo(cx+shW*0.28, hipY, cx+shW*0.22, shY+bodyH*0.02);
    g.closePath();
  }, inkLevel(0));
  // vertical robe folds
  g.strokeStyle = INK; g.lineWidth = 2.2; g.lineCap="round";
  for(const ff of [-0.5,0,0.5]){
    g.beginPath(); g.moveTo(cx+ff*shW*0.5, shY+bodyH*0.04);
    g.quadraticCurveTo(cx+ff*hemW*0.55, hipY, cx+ff*hemW*0.6, hemY-4); g.stroke();
  }
  // resting arms down the robe (she reaches nothing back)
  pen.limb(()=>{ g.moveTo(cx-shW*0.46, shY+bodyH*0.02); g.lineTo(cx-shW*0.52, hipY); }, robe, bodyH*0.05);
  pen.limb(()=>{ g.moveTo(cx+shW*0.46, shY+bodyH*0.02); g.lineTo(cx+shW*0.52, hipY); }, robe, bodyH*0.05);

  // ---- neck + head ----
  pen.limb(()=>{ g.moveTo(cx, shY); g.lineTo(cx, headCy+headR*0.7); }, robe, bodyH*0.045);
  setContour();
  pen.paint(()=>{ g.arc(cx, headCy, headR, 0, TAU); }, toneSolid(inkLevel(2)), 3);
  g.setLineDash([]);
  // veil framing the head (a woman, the mother)
  pen.paint(()=>{
    g.moveTo(cx-headR*1.06, headCy-headR*0.05);
    g.quadraticCurveTo(cx, headCy-headR*1.55, cx+headR*1.06, headCy-headR*0.05);
    g.quadraticCurveTo(cx+headR*1.34, headCy+headR*1.4, cx+headR*0.85, shY-bodyH*0.01);
    g.quadraticCurveTo(cx, headCy+headR*0.95, cx-headR*0.85, shY-bodyH*0.01);
    g.quadraticCurveTo(cx-headR*1.34, headCy+headR*1.4, cx-headR*1.06, headCy-headR*0.05);
    g.closePath();
  }, toneSolid(inkLevel(3)), 2.6);
  // bright face oval inside the veil
  pen.paint(()=>{ g.ellipse(cx, headCy, headR*0.62, headR*0.8, 0,0,TAU); }, toneSolid(inkLevel(1)), 2.2);

  g.restore();
  g.setLineDash([]);
  return { headX:cx, headY:headCy, shY, topY, hemY, bodyW:hemW*2 };
}

/* ---- rising WISPS: the substance the shade loses, streaming up off her head +
   shoulders and spreading apart — DARK smoke flecks + a few curling tendrils, so
   she reads as coming apart into vapour that the closing arms pass through.
   `amt` = dispersal (0..1). ---- */
function drawWisps(pen,g,W,H,cx,shade,amt,t){
  if (amt < 0.03) return;
  const baseY = shade.headY + (shade.shY-shade.headY)*0.3;      // rise from head/shoulders
  const spread = shade.bodyW*0.62;
  g.save();
  g.lineCap="round";
  // curling smoke tendrils behind the flecks
  for(let k=-2;k<=2;k++){
    const x0 = cx + k*spread*0.30;
    g.globalAlpha = amt*0.55;
    g.strokeStyle = inkLevel(4); g.lineWidth = lerp(6,2,Math.abs(k)/2);
    g.beginPath(); g.moveTo(x0, baseY);
    g.quadraticCurveTo(x0 + Math.sin(t*1.1+k)*W*0.07, baseY-H*0.13,
                       x0 + Math.sin(t*0.7+k*1.3)*W*0.11, baseY-H*0.27);
    g.stroke();
  }
  // dark flecks scattering upward + outward
  const n = params.wisps;
  for(let i=0;i<n;i++){
    const seed = (i*61 % 47)/47;
    const ph = (seed + t*0.5 + i*0.017) % 1;                    // 0 at body .. 1 risen away
    const rise = ph*H*0.36;
    const x = cx + (seed-0.5)*spread + Math.sin(seed*TAU + t*1.5 + ph*3)*W*0.07*(0.3+ph);
    const y = baseY - rise;
    const r = lerp(W*0.020, W*0.005, ph) * (0.55+0.45*amt);
    g.globalAlpha = (1-ph*0.8)*amt;
    g.fillStyle = inkLevel(6);
    g.beginPath(); g.ellipse(x, y, r, r*1.2, 0,0,TAU); g.fill();
  }
  g.globalAlpha = 1; g.restore();
}

/* ---- SOURCE: the living reaching arm-pair, rising from the foreground bottom
   and closing inward to embrace. `k` (grasp 0..1) opens->closes them; at k=1 the
   hands cross PAST center — they have closed on nothing. Darkest, hardest shapes
   in the frame (living flesh vs the pale shade). Returns the two hand points. ---- */
function drawArms(pen,g,W,H,k){
  const flesh = toneSolid(inkLevel(5));
  const kk = smooth(clamp01(k));
  // shoulders anchored below the frame in the foreground
  const shL = { x:W*0.20, y:H*1.06 }, shR = { x:W*0.80, y:H*1.06 };
  // elbows swing inward + up as the arms close (a real bend so they read as arms)
  const elL = { x:lerp(W*0.30,W*0.37,kk), y:lerp(H*0.78,H*0.70,kk) };
  const elR = { x:lerp(W*0.70,W*0.63,kk), y:lerp(H*0.78,H*0.70,kk) };
  // hands rise to the shade's chest and close inward; at full grasp they CROSS
  // past center — closed on nothing. A gap remains at the neutral half-grasp.
  const hL = { x:lerp(W*0.38, W*0.55, kk), y:lerp(H*0.54, H*0.42, kk) };
  const hR = { x:lerp(W*0.62, W*0.45, kk), y:lerp(H*0.54, H*0.42, kk) };

  const upperW = H*0.052, foreW = H*0.038, handR = H*0.040;
  const arm = (sh,el,hd,front)=>{
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(el.x,el.y); }, flesh, upperW);
    pen.limb(()=>{ g.moveTo(el.x,el.y); g.lineTo(hd.x,hd.y); }, flesh, foreW);
    // hand: palm + a hint of curled fingers reaching
    pen.paint(()=>{ g.ellipse(hd.x, hd.y, handR*1.15, handR, 0,0,TAU); }, flesh, 4);
    g.strokeStyle = INK; g.lineWidth = 3; g.lineCap="round";
    const dir = front>0 ? -1 : 1;                       // fingers curl toward center
    for(let f=-1;f<=1;f++){
      g.beginPath(); g.moveTo(hd.x + dir*handR*0.7, hd.y + f*handR*0.5);
      g.lineTo(hd.x + dir*handR*1.5, hd.y + f*handR*0.55);
      g.stroke();
    }
  };
  // far arm first (right), then near arm (left) so the near hand overlaps in front
  arm(shR, elR, hR, +1);
  arm(shL, elL, hL, -1);
  return { hL, hR };
}

/* ---- three ATTEMPT-MARKERS: a small tally of the contact attempts, read as
   three bars standing on a baseline. Completed attempts are full dark bars, the
   current attempt a taller flagged bar, attempts to come are short faint stubs.
   Reads as "attempt N of three". Kept to the upper-right so it doesn't crowd the
   figure or the card label. ---- */
function drawMarkers(pen,g,W,H,attempt,t){
  const n = params.attempts;
  const bw = W*0.018, gap = W*0.040, h = H*0.055;
  const baseY = H*0.135;
  const x0 = W*0.70;
  // baseline
  g.strokeStyle = INK; g.lineWidth = 3; g.lineCap="round";
  g.beginPath(); g.moveTo(x0-bw, baseY); g.lineTo(x0+gap*(n-1)+bw, baseY); g.stroke();
  for(let i=0;i<n;i++){
    const x = x0 + i*gap, idx = i+1;
    if (idx < attempt){                                 // completed attempt — full bar
      pen.paint(()=>{ g.rect(x-bw/2, baseY-h, bw, h); }, toneSolid(inkLevel(6)), 2.5);
    } else if (idx === attempt){                        // current attempt — taller, flagged
      const hh = h*1.35;
      pen.paint(()=>{ g.rect(x-bw/2, baseY-hh, bw, hh); }, toneSolid(inkLevel(7)), 3);
      // a small pennant flag at its top
      g.fillStyle = inkLevel(7);
      g.beginPath(); g.moveTo(x+bw/2, baseY-hh);
      g.lineTo(x+bw/2+W*0.026, baseY-hh+h*0.16);
      g.lineTo(x+bw/2, baseY-hh+h*0.32); g.closePath(); g.fill();
    } else {                                            // pending attempt — short faint stub
      pen.paint(()=>{ g.rect(x-bw/2, baseY-h*0.45, bw, h*0.45); }, toneSolid(inkLevel(2)), 2.5);
    }
  }
}

/* grasp k(t): arms open -> closed (t~0.55) -> open, one attempt cycle. */
function graspAt(t){ return t<0.55 ? smooth(t/0.55) : smooth(1-(t-0.55)/0.45); }
/* dispersal d(t): shade holds until the arms near her (t>0.2), goes fully to
   wisps by ~0.58, then reforms by ~0.98 — coupled to, and lagging, the grasp. */
function dispersalAt(t){
  if (t < 0.2) return smooth(t/0.2)*0.12;                       // faint stir as they rise
  if (t < 0.58) return lerp(0.12,1, smooth((t-0.2)/0.38));      // disperses as they close
  return lerp(1,0, smooth((t-0.58)/0.40));                      // reforms as they open
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = clamp01(st.t ?? 0.42);
  const grasp = (typeof st.grasp==="number") ? clamp01(st.grasp) : graspAt(t);
  const disp  = (typeof st.dispersal==="number") ? clamp01(st.dispersal) : dispersalAt(t);
  const m = 1 - disp;                                           // materialization
  const attempt = clamp(st.attempt ?? 2, 1, params.attempts);
  const cx = params.shadeCX*W;

  const layers = st.layers || ["field","shade","wisps","arms","markers"];
  const has = l => layers.includes(l);

  let shade = { dissY:H*params.shadeHem, headX:cx, headY:H*params.shadeTop, bodyW:W*0.3 };
  if (has("field"))   drawField(pen,g,W,H);
  if (has("shade"))   shade = drawShade(pen,g,W,H,m);
  if (has("wisps"))   drawWisps(pen,g,W,H,cx,shade,disp,t);
  if (has("arms"))    drawArms(pen,g,W,H,grasp);
  if (has("markers")) drawMarkers(pen,g,W,H,attempt,t);

  return { anchors: asset.anchors, grasp, dispersal:disp };
}

export const asset = {
  id:"divine_fx.intangible-embrace-effect",
  type:"DIVINE_FX",
  name:"Intangible embrace effect",
  statusWord:"UNGRASPED",
  scene:"OD-B11-S04",

  params,
  // back -> front draw order; scene state may pass a subset
  layers:["field","shade","wisps","arms","markers"],
  // normalized 0..1 source/target/field/transform/consequence anchors
  anchors:{
    "source:arms":{      x:0.50, y:0.98 },   // where the living arms rise from
    "target:shade":{     x:0.50, y:0.46 },   // the pale figure being reached for
    "shade:head":{       x:0.50, y:0.29 },   // the head that leads the reform
    "field:embrace":{    x:0.50, y:0.50 },   // the gloom the embrace happens in
    "transform:wisps":{  x:0.50, y:0.22 },   // where the dispersed shade rises
    "hand:left":{        x:0.57, y:0.47 },   // left hand contact (passes through)
    "hand:right":{       x:0.43, y:0.47 },   // right hand contact (passes through)
    "marker:attempts":{  x:0.50, y:0.115 },  // the three-attempt tally
    "camera:wide":{      x:0.50, y:0.50 },
  },
  // affected regions
  zones:{
    shade:{ x0:0.34, y0:0.22, x1:0.66, y1:0.72 },
    wisp:{  x0:0.30, y0:0.06, x1:0.70, y1:0.68 },
    arms:{  x0:0.06, y0:0.44, x1:0.94, y1:1.00 },
  },
  // DIVINE_FX transform states: reaching -> dispersing -> reforming (one attempt)
  states:{
    initial:"dispersing",
    nodes:{
      // arms rising and opening toward her, the shade still whole (source/target)
      reaching:{   preview:{ grasp:0.32, dispersal:0.06, attempt:1, t:0.15,
                             status:"REACHING",  progress:0.15,
                             layers:["field","shade","wisps","arms","markers"] } },
      // arms closing, the shade breaking upward into wisps (neutral money-shot)
      dispersing:{ preview:{ grasp:0.5, dispersal:0.55, attempt:2, t:0.42,
                             status:"UNGRASPED", progress:0.50,
                             layers:["field","shade","wisps","arms","markers"] } },
      // arms opening again, the shade coalescing back whole before the next try
      reforming:{  preview:{ grasp:0.22, dispersal:0.24, attempt:3, t:0.88,
                             status:"REFORMING", progress:0.88,
                             layers:["field","shade","wisps","arms","markers"] } },
    },
    edges:[["reaching","dispersing"],["dispersing","reforming"],["reforming","reaching"]],
  },
  duration:4.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","grasp","dispersal","attempt","intensity"],

  // neutral preview: arms closing through her, the shade half gone to a rising
  // column of wisps, two attempts marked — reads unmistakably as an embrace that
  // cannot hold the dead.
  preview:()=>({ grasp:0.5, dispersal:0.55, attempt:2, t:0.42,
                 status:"UNGRASPED", progress:0.50,
                 layers:["field","shade","wisps","arms","markers"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
