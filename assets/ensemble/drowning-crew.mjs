/* ensemble.drowning-crew — men thrown from a wreck into the sea.
   ENSEMBLE asset. Scene function (OD-B12-S07): the crew is FLUNG from a
   foundering ship "like scattered seabirds", separated across the swell,
   flailing, and taken UNDER one by one. Built from ONE separable member
   template (drawSwimmer) instanced N times deterministically in a
   SCATTERED-IN-WAVES formation. Each member carries its own SINK value
   (0 = riding the crest, 1 = gone — only a ring of foam left) and a FLAIL
   phase, so the sea can remove them one at a time as `sink` / `claimed`
   advance. Drawn in SOLID grays + hard contour; the engine dotify pass
   supplies the halftone. The wreck is NOT baked as a vehicle — only a couple
   of drifting spar fragments (the lost "supports") sit among the men. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "/engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

const params = {
  formation:"scattered-in-waves", // scattered-in-waves | line-abreast
  count:7,                        // crew members flung into the sea
  claimed:0.35,                   // how far the sea has advanced taking them (0..1)
  flail:0.8,                      // collective flail intensity (arm thrashing)
  spread:0.9,                     // how separated across the swell (0=huddled..1=scattered)
  waveAmp:0.06,                   // swell height as fraction of H
  waveN:2.4,                      // number of crests across the width
  horizon:0.30,                   // sky/sea seam as fraction of H
  t:0,                            // clock for flail + swell drift
  showSpars:true,                 // drifting broken supports among the men
};

/* two-segment flailing arm: shoulder -> elbow -> wrist, thrown upward */
function flailArm(pen, sh, wr, tone, w){
  const mx=(sh.x+wr.x)/2, my=(sh.y+wr.y)/2;
  const el={ x:mx - (wr.x-sh.x)*0.10, y:my - Math.abs(wr.x-sh.x)*0.14 - w*0.4 };
  pen.limb(()=>{ pen.ctx.moveTo(sh.x,sh.y); pen.ctx.lineTo(el.x,el.y); }, tone, w);
  pen.limb(()=>{ pen.ctx.moveTo(el.x,el.y); pen.ctx.lineTo(wr.x,wr.y); }, tone, w*0.84);
  return wr;
}

/* concentric foam/ripple rings around a point on the water — how a man's
   place is marked once the sea has him */
function ripples(g, cx, cy, r, n, strength){
  g.save();
  g.strokeStyle=INK; g.lineCap="round";
  for (let k=1;k<=n;k++){
    g.globalAlpha = clamp01(strength*(1 - (k-1)/n))*0.55;
    g.lineWidth = Math.max(1.5, r*0.06);
    g.beginPath();
    g.ellipse(cx, cy, r*k*0.62, r*k*0.62*0.34, 0, 0, Math.PI*2);
    g.stroke();
  }
  g.restore();
}

/* ============================================================
   ONE member template — a drowning man.
   Keyed off `s` (member scale) and `sink` (0 above the surface, 1 gone).
   The waterline sits at m.waterY; the body is drawn crown-down and CLIPPED
   to the water so rising `sink` pulls him under head-last. `flail` throws the
   arms up out of the swell; `feat` carries deterministic identity.
   ============================================================ */
function drawSwimmer(pen, m){
  const g = pen.ctx, s = m.s;
  const waterY = m.waterY;
  const sink = clamp01(m.sink);

  // fully taken: nothing but a closing ring of foam
  if (sink >= 0.985){
    ripples(g, m.cx, waterY, s*0.34, 3, 0.9);
    return { head:{x:m.cx,y:waterY}, r:s*0.1, gone:true };
  }

  const skin = toneSolid(inkLevel(m.shade.skin));
  const tunic= toneSolid(inkLevel(m.shade.tunic));
  const dark = toneSolid(inkLevel(m.shade.hair));

  // vertical geometry: crown starts one body-height above water at sink 0,
  // and slides down so the crown meets the water at sink 1.
  const bodyH  = s*1.15;
  const crownY = waterY - (1 - sink)*bodyH;
  const headR  = s*0.15*m.feat.headS;
  const headCx = m.cx + Math.sin(m.t*1.4 + m.seed)*s*0.05;   // bob laterally
  const headCy = crownY + headR;
  const shoY   = headCy + headR*1.4;
  const shoHalf= s*0.20;
  const hipY   = shoY + s*0.5;

  // clip everything to above the waterline (the sea hides the rest)
  g.save();
  g.beginPath();
  g.rect(m.cx - s*0.9, crownY - s*0.9, s*1.8, (waterY - (crownY - s*0.9)) );
  g.clip();

  const lw = Math.max(2, s*0.03);

  // ---- torso: a short tunic'd trunk sinking into the swell ----
  pen.paint(()=>{
    g.moveTo(m.cx-shoHalf*0.7, hipY);
    g.lineTo(m.cx+shoHalf*0.7, hipY);
    g.lineTo(headCx+shoHalf, shoY);
    g.lineTo(headCx-shoHalf, shoY);
    g.closePath();
  }, tunic, lw);

  // ---- arms flung up out of the water (the flail) ----
  const shL={ x:headCx-shoHalf*0.9, y:shoY+s*0.02 };
  const shR={ x:headCx+shoHalf*0.9, y:shoY+s*0.02 };
  const armW = Math.max(3, s*0.075);
  // flail phase throws each arm up and outward, thrashing over t
  const ph = m.t*3.0 + m.seed;
  const thrash = m.flail*(0.6 + 0.4*Math.sin(ph));
  const reachL = headR*(1.5 + 1.4*thrash);
  const reachR = headR*(1.5 + 1.4*(m.flail*(0.6+0.4*Math.sin(ph+2.1))));
  const wrL={ x:headCx - shoHalf - reachL*0.7*(0.6+0.5*Math.sin(ph+0.7)),
              y:shoY - reachL*(0.7+0.3*Math.sin(ph+1.3)) };
  const wrR={ x:headCx + shoHalf + reachR*0.7*(0.6+0.5*Math.sin(ph+1.9)),
              y:shoY - reachR*(0.7+0.3*Math.sin(ph)) };
  // far arm, then head, then near arm on top
  flailArm(pen, shL, wrL, skin, armW*0.9);

  // ---- neck + head ----
  pen.paint(()=>{ g.rect(headCx-headR*0.28, shoY-headR*0.5, headR*0.56, headR*0.8); }, skin, Math.max(2,s*0.016));
  if (m.feat.hair!=="bald")
    pen.paint(()=>{ g.ellipse(headCx, headCy+headR*0.12, headR*1.12, headR*1.2, 0,0,7); }, dark, Math.max(2,s*0.024));
  pen.paint(()=>{ g.ellipse(headCx, headCy, headR*0.92, headR, 0,0,7); }, skin, Math.max(2,s*0.026));

  // face: chin up, gasping — wide eyes, open mouth fighting the water
  const eyeY = headCy - headR*0.10;
  const eyeR = headR*0.14;
  g.fillStyle=INK;
  g.beginPath(); g.ellipse(headCx-headR*0.34, eyeY, eyeR, eyeR*1.05, 0,0,7); g.fill();
  g.beginPath(); g.ellipse(headCx+headR*0.34, eyeY, eyeR, eyeR*1.05, 0,0,7); g.fill();
  // high alarmed brows
  g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.14); g.lineCap="round";
  g.beginPath(); g.moveTo(headCx-headR*0.5, eyeY-headR*0.28); g.lineTo(headCx-headR*0.14, eyeY-headR*0.42); g.stroke();
  g.beginPath(); g.moveTo(headCx+headR*0.14, eyeY-headR*0.42); g.lineTo(headCx+headR*0.5, eyeY-headR*0.28); g.stroke();
  // nose
  g.lineWidth=Math.max(2,headR*0.11);
  g.beginPath(); g.moveTo(headCx, eyeY+headR*0.1); g.lineTo(headCx+headR*0.06, eyeY+headR*0.42); g.stroke();
  // gasping mouth
  g.fillStyle=INK; g.beginPath();
  g.ellipse(headCx, headCy+headR*0.52, headR*0.16, headR*0.16, 0,0,7); g.fill();
  // hair front cap
  if (m.feat.hair!=="bald")
    pen.paint(()=>{
      g.moveTo(headCx-headR*0.95, headCy-headR*0.02);
      g.quadraticCurveTo(headCx, headCy-headR*1.35, headCx+headR*0.95, headCy-headR*0.02);
      g.quadraticCurveTo(headCx+headR*0.5, headCy-headR*0.5, headCx, headCy-headR*0.45);
      g.quadraticCurveTo(headCx-headR*0.5, headCy-headR*0.5, headCx-headR*0.95, headCy-headR*0.02);
    }, dark, Math.max(2,s*0.02));
  if (m.feat.beard)
    pen.paint(()=>{
      g.moveTo(headCx-headR*0.5, headCy+headR*0.35);
      g.quadraticCurveTo(headCx, headCy+headR*1.35, headCx+headR*0.5, headCy+headR*0.35);
      g.quadraticCurveTo(headCx, headCy+headR*0.7, headCx-headR*0.5, headCy+headR*0.35);
    }, dark, Math.max(2,s*0.016));

  // near arm on top
  flailArm(pen, shR, wrR, skin, armW);
  // hands: clutching knuckle-blobs at the flung wrists
  pen.paint(()=>{ g.arc(wrL.x, wrL.y, headR*0.26, 0, 7); }, skin, lw*0.7);
  pen.paint(()=>{ g.arc(wrR.x, wrR.y, headR*0.26, 0, 7); }, skin, lw*0.7);

  g.restore(); // end waterline clip

  // ---- foam/splash where the body cuts the surface ----
  const splash = 0.4 + 0.6*sink;
  ripples(g, headCx, waterY, headR*(1.4+1.2*sink), 2 + Math.round(sink*1.5), splash);
  // a low white splash lip at the torso entry
  g.save(); g.strokeStyle="#ffffff"; g.globalAlpha=0.5; g.lineWidth=Math.max(2,s*0.05); g.lineCap="round";
  g.beginPath();
  g.moveTo(headCx-headR*1.2, waterY);
  g.quadraticCurveTo(headCx, waterY-headR*0.5, headCx+headR*1.2, waterY);
  g.stroke();
  g.restore();

  return { head:{x:headCx,y:headCy}, r:headR, sink, gone:false };
}

/* the sea: light sky, an even-toned sea field that steps very slightly darker
   toward the foreground, and repeated wavy CREST LINES that carry the swell.
   Kept light so the men read as dark marks ON the water. Returns waveYAt(x). */
function drawSea(pen, W, H, p){
  const g = pen.ctx;
  const horizon = H*p.horizon;
  const amp = H*p.waveAmp;
  const k = (Math.PI*2*p.waveN)/W;
  const drift = p.t*0.6;
  const waveYAt = (x, base)=> base + Math.sin(x*k + drift)*amp
                                  + Math.sin(x*k*0.5 - drift*0.7)*amp*0.4;

  // sky (lightest — sparse dots)
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);

  // sea field: clean rectangular tone ranks, gently darker toward foreground
  const bands = 5;
  for (let b=0;b<bands;b++){
    const y0 = lerp(horizon, H, b/bands);
    const y1 = lerp(horizon, H, (b+1)/bands);
    // 2 (far) .. 3 (near): stays light so figures dominate
    g.fillStyle = inkLevel(2 + Math.round(b*0.8/(bands-1)));
    g.fillRect(0, y0-1, W, y1-y0+2);
  }

  // crest lines: many wavy ink strokes, spaced tighter + darker toward front
  g.lineCap="round";
  const rows = 16;
  for (let r=1;r<=rows;r++){
    const f = r/rows;                              // 0 far .. 1 near
    const yBase = lerp(horizon+amp, H*0.99, f*f);  // perspective: pack near horizon
    g.strokeStyle=INK;
    g.globalAlpha = lerp(0.16, 0.42, f);
    g.lineWidth = Math.max(1.5, H*0.003*(0.6+f));
    const localAmp = amp*(0.5+1.0*f);              // bigger swell up close
    g.beginPath();
    for (let x=0;x<=W;x+=W/70){
      const y = yBase + Math.sin(x*k + drift + r*0.5)*localAmp
                      + Math.sin(x*k*0.5 - drift*0.7)*localAmp*0.35;
      if (x===0) g.moveTo(x,y); else g.lineTo(x,y);
    }
    g.stroke();
  }
  g.globalAlpha=1;
  // horizon line
  g.strokeStyle=INK; g.lineWidth=Math.max(2,H*0.004); g.globalAlpha=0.55;
  g.beginPath(); g.moveTo(0,horizon); g.lineTo(W,horizon); g.stroke();
  g.globalAlpha=1;

  return { waveYAt, horizon, amp };
}

/* a drifting broken spar — the lost "support" the men are separated from */
function drawSpar(pen, x, y, len, ang, w){
  const g = pen.ctx;
  g.save(); g.translate(x,y); g.rotate(ang);
  pen.paint(()=>{ g.rect(-len/2, -w/2, len, w); }, toneSolid(inkLevel(5)), Math.max(2,w*0.4));
  // a couple of plank seams
  pen.seam(()=>{ g.moveTo(-len/2, 0); g.lineTo(len/2, 0); }, Math.max(1.5,w*0.12));
  g.restore();
}

function buildMembers(W, H, sea, p){
  const n = Math.max(1, p.count|0);
  const claimed = clamp01(p.claimed);
  const spread = clamp01(p.spread);
  const members = [];
  for (let i=0;i<n;i++){
    const rng = rnd((i*911 + 37)>>>0);
    // scattered across the width, then jittered by `spread`
    const base = (i+0.5)/n;
    const px = clamp(base + (rng()-0.5)*0.18*spread, 0.08, 0.92);
    // depth: further members ride higher (nearer horizon) and smaller
    const depth = clamp01(0.15 + rng()*0.85);          // 0 far .. 1 near
    const yBaseF = lerp(p.horizon+0.06, 0.9, depth);
    const cx = W*px;
    const waterY = sea.waveYAt(cx, H*yBaseF);
    const scale = lerp(58, 150, depth);
    // "one by one": order members by depth so the NEAR ones (front of the
    // reckoning) are taken first; sink advances with `claimed`.
    const order = rng();                                // stable per-member draw
    // members with order < claimed are sinking/gone; smooth the transition
    const sink = smooth(clamp01((claimed - order)/0.28 + 0.0));
    const feat = { beard: rng()<0.55, hair: rng()<0.16?"bald":"full",
                   headS: 0.9+rng()*0.24 };
    members.push({
      cx, waterY, s:scale, depth, px, seed:i*1.7+rng()*6.28,
      sink, flail: clamp01(p.flail*(1-sink*0.6)), t:p.t,
      feat,
      shade:{
        tunic: Math.round(lerp(3,4,depth)),
        skin:  Math.round(lerp(3,4,depth)),
        hair:  Math.round(lerp(5,6,depth)),
      },
    });
  }
  // draw far (small) -> near (large) so nearer men overpaint
  members.sort((a,b)=>a.depth-b.depth);
  return members;
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const p = { ...params, ...st };
  const sea = drawSea(pen, W, H, p);

  // drifting spars scattered among the men (lost supports)
  if (p.showSpars){
    drawSpar(pen, W*0.20, sea.waveYAt(W*0.20, H*0.62), W*0.16, -0.22, H*0.018);
    drawSpar(pen, W*0.74, sea.waveYAt(W*0.74, H*0.80), W*0.20,  0.14, H*0.022);
  }

  const members = buildMembers(W, H, sea, p);
  members.forEach(m => drawSwimmer(pen, m));
}

export const asset = {
  id:"ensemble.drowning-crew",
  type:"ENSEMBLE",
  name:"Drowning crew",
  statusWord:"FOUNDERING",
  scene:"OD-B12-S07",

  params,
  // back -> front draw order the ensemble honors
  layers:["sky","sea-bands","crest-lines","spars","far-men","mid-men","near-men","foam"],
  // normalized 0..1 anchors: the swell field, wreck-drift, camera
  anchors:{
    "crest:left":{x:.14,y:.44}, "crest:mid":{x:.50,y:.58}, "crest:right":{x:.86,y:.72},
    "spar:a":{x:.20,y:.62}, "spar:b":{x:.74,y:.80},
    "sink:next":{x:.50,y:.82}, "horizon:sea":{x:.50,y:.30},
    "camera:wide":{x:.50,y:.55},
  },
  zones:{ swell:{ x0:.04,y0:.34,x1:.96,y1:.96 }, deep:{ x0:.10,y0:.70,x1:.90,y1:.96 } },
  states:{
    initial:"scattered",
    nodes:{
      // just flung from the wreck — all up, flailing, none gone yet
      thrown:    { preview:{ claimed:0.05, flail:0.95, spread:0.7, status:"THROWN" } },
      // separated across the swell, thrashing, the sea starting to take them
      scattered: { preview:{ claimed:0.35, flail:0.85, spread:0.9, status:"SCATTERED" } },
      // the sea advancing — several under, foam-rings closing, few left flailing
      sinking:   { preview:{ claimed:0.7,  flail:0.6,  spread:0.9, status:"SINKING" } },
      // taken one by one — mostly rings of foam, a last hand or two
      taken:     { preview:{ claimed:0.95, flail:0.3,  spread:0.95, status:"TAKEN" } },
    },
    edges:[
      ["thrown","scattered"],["scattered","sinking"],["sinking","taken"],
    ],
  },
  channels:["claimed","sink","flail","spread","waveAmp","t","count"],

  // neutral preview = scattered-in-waves, thrashing, the sea mid-reckoning
  preview:()=>({ claimed:0.35, flail:0.85, spread:0.9, formation:"scattered-in-waves",
                 t:0.6, status:"FOUNDERING", progress:0.35 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
