/* ensemble.assembly-reaction-wave — the Ithacan assembly under a sudden omen.
   ENSEMBLE asset. Scene function (OD-B02-S03): a standing crowd of citizens hit
   by a RIPPLE of reaction that sweeps across the ranks — they DUCK, then STARE
   UPWARD at the sign, MURMUR to their neighbours, and finally DIVIDE into two
   leaning factions under competing interpretations. Built from ONE separable
   member template (drawCitizen) instanced N times deterministically. Exposes
   formation, density, attention (upward pull toward the omen), and the key
   REACTION-WAVE controls: `wave` (front progress across the crowd) + `waveLag`
   (per-member lag), plus a `phase` that selects the collective behaviour. Drawn
   in SOLID grays + hard contour; the engine dotify pass supplies the halftone.
   Do NOT bake the omen source as a character — it is a small diagrammatic sign
   the heads turn toward. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

const params = {
  formation:"rows",     // rows | arc | cluster
  rows:3,               // depth tiers (back..front)
  perRow:[9,7,5],       // members per tier (density)
  phase:"stare",        // duck | stare | murmur | divide
  wave:0.6,             // reaction-wave FRONT position, 0=left edge .. 1=passed all
  waveLag:0.7,          // per-member LAG spread of the wave across the crowd
  attention:0.8,        // upward pull toward the omen (0=none .. 1=full)
  showOmen:true,        // draw the small twin-eagle sign overhead
  showRays:true,        // faint attention rays from omen to the ranks
  groundY:0.90,         // front-row footline as fraction of H
};

/* ============================================================
   ONE member template — a standing citizen.
   All geometry keyed off `s` (member height). The reaction pose is driven by
   four scalars packed on the member: duck, leanX, headTurn, lookUp, plus an
   `armMode` string. `feat` carries deterministic identity so the crowd reads
   as individuals.
   ============================================================ */
function armTo(pen, sh, wr, tone, w){
  // 2-segment arm shoulder->elbow->wrist; elbow sags toward the midpoint
  const mx=(sh.x+wr.x)/2, my=(sh.y+wr.y)/2;
  const el={ x:mx + (wr.x-sh.x)*0.08, y:my + Math.abs(wr.x-sh.x)*0.12 + w*0.6 };
  pen.limb(()=>{ pen.ctx.moveTo(sh.x,sh.y); pen.ctx.lineTo(el.x,el.y); }, tone, w);
  pen.limb(()=>{ pen.ctx.moveTo(el.x,el.y); pen.ctx.lineTo(wr.x,wr.y); }, tone, w*0.86);
  return wr;
}

function drawCitizen(pen, m){
  const g = pen.ctx, s = m.s;
  const duck = m.duck, leanX = m.leanX, headTurn = m.headTurn, lookUp = m.lookUp;
  const tunic = toneSolid(inkLevel(m.shade.tunic));
  const skin  = toneSolid(inkLevel(m.shade.skin));
  const leg   = toneSolid(inkLevel(m.shade.leg));
  const dark  = toneSolid(inkLevel(m.shade.hair));

  const footY   = m.baseY;
  const footHalf= s*0.13, hipHalf = s*0.10, shoHalf = s*0.155;
  const legLen  = s*0.44, torsoLen= s*0.34;
  const hipY    = footY - legLen*(1 - 0.34*duck);
  const kneeY   = footY - legLen*0.50*(1 - 0.10*duck);
  const kneeHalf= hipHalf + s*0.055*duck;
  const shoCx   = m.cx + leanX;
  const shoY    = hipY - torsoLen*(1 - 0.10*duck);
  const headR   = s*0.115*m.feat.headS;
  const headCx  = shoCx + leanX*0.22 + headTurn*headR*0.38;
  // looking up tilts the whole head back: it rides higher and further back
  const headCy  = shoY - headR*1.0 - s*0.02 - lookUp*headR*0.55;
  const lw      = Math.max(2, s*0.03);

  // ---- legs (bare, mid tone) : hip -> knee -> foot ----
  const legW = Math.max(3, s*0.075);
  for (const side of [-1, 1]){
    const hp={ x:m.cx+side*hipHalf, y:hipY };
    const kp={ x:m.cx+side*kneeHalf, y:kneeY };
    const fp={ x:m.cx+side*footHalf, y:footY };
    pen.limb(()=>{ g.moveTo(hp.x,hp.y); g.lineTo(kp.x,kp.y); }, leg, legW);
    pen.limb(()=>{ g.moveTo(kp.x,kp.y); g.lineTo(fp.x,fp.y); }, leg, legW*0.9);
    // foot
    pen.paint(()=>{ g.ellipse(fp.x+side*s*0.03, fp.y, s*0.07, s*0.032, 0,0,7); }, toneSolid(inkLevel(6)), lw*0.7);
  }

  // ---- torso: tunic trapezoid, hips -> shoulders (leaning) ----
  pen.paint(()=>{
    g.moveTo(m.cx-hipHalf, hipY);
    g.lineTo(m.cx+hipHalf, hipY);
    g.lineTo(shoCx+shoHalf, shoY);
    g.lineTo(shoCx-shoHalf, shoY);
    g.closePath();
  }, tunic, lw);
  // drapery seams read as a chiton
  pen.seam(()=>{ g.moveTo(shoCx, shoY+s*0.02); g.lineTo(m.cx, hipY); }, Math.max(2,s*0.016));
  pen.seam(()=>{ g.moveTo(shoCx-shoHalf*0.5, shoY+s*0.04); g.lineTo(m.cx-hipHalf*0.6, hipY); }, Math.max(1.5,s*0.013));

  // ---- neck ----
  pen.paint(()=>{ g.rect(headCx-headR*0.30, shoY-headR*0.55, headR*0.60, headR*0.8); }, skin, Math.max(2,s*0.018));

  // ---- shoulders ----
  const shL={ x:shoCx-shoHalf*0.92, y:shoY+s*0.015 };
  const shR={ x:shoCx+shoHalf*0.92, y:shoY+s*0.015 };
  const armW = Math.max(3, s*0.06);

  // ---- FAR arm (drawn behind head via mode) ----
  const armWrist = (side, sh)=>{
    // returns a wrist target for this side given armMode
    switch(m.armMode){
      case "up":    return { x: headCx + side*headR*0.55, y: headCy - headR*1.15 };      // hands thrown up (ducking cover)
      case "brow":  return side===m.faceSide
                       ? { x: headCx + side*headR*0.15, y: headCy - headR*0.55 }         // near hand shading brow
                       : { x: sh.x + side*s*0.02, y: hipY - s*0.02 };
      case "mouth": return side===m.faceSide
                       ? { x: headCx + side*headR*0.20, y: headCy + headR*0.55 }         // cupped hand at mouth (murmur)
                       : { x: sh.x + side*s*0.03, y: hipY - s*0.02 };
      case "out":   return side===m.divSide
                       ? { x: sh.x + side*s*0.26, y: shoY + torsoLen*0.35 }              // gesturing outward (dividing)
                       : { x: sh.x + side*s*0.02, y: hipY - s*0.02 };
      default:      return { x: sh.x + side*s*0.03, y: hipY - s*0.02 };                  // arms at sides
    }
  };

  // FAR arm first (side away from head lean) then head, then NEAR arm on top
  const nearSide = headTurn>=0 ? 1 : -1;
  const farSide  = -nearSide;
  armTo(pen, farSide<0?shL:shR, armWrist(farSide, farSide<0?shL:shR), tunic, armW*0.9);

  // ---- head ----
  // hair back
  if (m.feat.hair!=="bald")
    pen.paint(()=>{ g.ellipse(headCx, headCy+headR*0.12, headR*1.12, headR*1.2, 0,0,7); }, dark, Math.max(2,s*0.026));
  pen.paint(()=>{ g.ellipse(headCx, headCy, headR*0.92, headR, 0,0,7); }, skin, Math.max(2,s*0.028));

  // ---- face : eyes/brow/nose, all lifted when looking up ----
  const eyeY = headCy - headR*0.05 - lookUp*headR*0.30;
  const gx   = headTurn*headR*0.28;
  const eyeR = headR*0.11;
  g.fillStyle = INK;
  const eL = headCx - headR*0.34 + gx, eR = headCx + headR*0.34 + gx;
  if (headTurn > -0.6){ g.beginPath(); g.ellipse(eR, eyeY, eyeR, eyeR*1.1, 0,0,7); g.fill(); }
  if (headTurn <  0.6){ g.beginPath(); g.ellipse(eL, eyeY, eyeR, eyeR*1.1, 0,0,7); g.fill(); }
  // brow (rises with alarm/lookUp)
  g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.16); g.lineCap="round";
  g.beginPath();
  g.moveTo(headCx-headR*0.5+gx, eyeY-headR*0.34-lookUp*headR*0.1);
  g.lineTo(headCx+headR*0.5+gx, eyeY-headR*0.34-lookUp*headR*0.1);
  g.stroke();
  // nose — tips upward when the chin lifts to the sky
  g.lineWidth=Math.max(2,headR*0.12);
  g.beginPath();
  g.moveTo(headCx+gx*0.6, eyeY+headR*0.10);
  g.lineTo(headCx + headTurn*headR*0.40, eyeY+headR*0.44 - lookUp*headR*0.16);
  g.stroke();
  // open/murmuring mouth (a small dark oval when reacting)
  if (m.mouthOpen>0.15){
    g.fillStyle=INK; g.beginPath();
    g.ellipse(headCx+gx, headCy+headR*0.5, headR*0.16, headR*0.12*m.mouthOpen+headR*0.05, 0,0,7); g.fill();
  }

  // hair front cap + optional beard
  if (m.feat.hair!=="bald")
    pen.paint(()=>{
      g.moveTo(headCx-headR*0.95, headCy-headR*0.02);
      g.quadraticCurveTo(headCx, headCy-headR*1.35, headCx+headR*0.95, headCy-headR*0.02);
      g.quadraticCurveTo(headCx+headR*0.5, headCy-headR*0.5, headCx, headCy-headR*0.45);
      g.quadraticCurveTo(headCx-headR*0.5, headCy-headR*0.5, headCx-headR*0.95, headCy-headR*0.02);
    }, dark, Math.max(2,s*0.02));
  if (m.feat.beard)
    pen.paint(()=>{
      g.moveTo(headCx-headR*0.55, headCy+headR*0.35);
      g.quadraticCurveTo(headCx, headCy+headR*1.45, headCx+headR*0.55, headCy+headR*0.35);
      g.quadraticCurveTo(headCx, headCy+headR*0.7, headCx-headR*0.55, headCy+headR*0.35);
    }, dark, Math.max(2,s*0.018));

  // ---- NEAR arm on top ----
  armTo(pen, nearSide<0?shL:shR, armWrist(nearSide, nearSide<0?shL:shR), tunic, armW);

  return { head:{ x:headCx, y:headCy }, r:headR, act:m.act };
}

/* -------- the omen overhead: twin eagles clashing (Zeus's sign) --------
   Drawn as two clear birds with a gap between them — NOT enclosed in a disc
   (an enclosing oval reads as a face). Short radiating strokes mark the sign. */
function drawOmen(pen, cx, cy, s, attention){
  const g = pen.ctx;
  // radiating portent strokes (the sign flashing) — faint, no enclosing shape
  g.strokeStyle=INK; g.globalAlpha=0.35; g.lineCap="round"; g.lineWidth=Math.max(2,s*0.05);
  for (let k=0;k<10;k++){ const ang=k/10*Math.PI*2;
    g.beginPath(); g.moveTo(cx+Math.cos(ang)*s*1.35, cy+Math.sin(ang)*s*0.95);
    g.lineTo(cx+Math.cos(ang)*s*1.7, cy+Math.sin(ang)*s*1.2); g.stroke(); }
  g.globalAlpha=1;
  // two eagles: filled bodies + spread wings, banking toward each other
  const eagle=(ex, dir)=>{
    // wings — a shallow M/W with a peak at the shoulders
    g.strokeStyle=INK; g.lineJoin="round"; g.lineCap="round"; g.lineWidth=Math.max(4,s*0.14);
    g.beginPath();
    g.moveTo(ex - s*0.55, cy - s*0.05);
    g.quadraticCurveTo(ex - s*0.22, cy - s*0.34, ex, cy - s*0.02);
    g.quadraticCurveTo(ex + s*0.22, cy - s*0.34, ex + s*0.55, cy - s*0.05);
    g.stroke();
    // body (filled) + short tail pointing the bank direction
    g.fillStyle=INK; g.beginPath();
    g.ellipse(ex, cy+s*0.06, s*0.10, s*0.24, dir*0.25, 0, 7); g.fill();
    // head
    g.beginPath(); g.arc(ex + dir*s*0.06, cy - s*0.14, s*0.09, 0, 7); g.fill();
  };
  eagle(cx - s*0.75, 1);
  eagle(cx + s*0.75, -1);
  // a struck spark where their paths clash (the disputed sign)
  g.fillStyle=ACCENT;
  g.beginPath(); g.arc(cx, cy+s*0.02, Math.max(3,s*0.08), 0, 7); g.fill();
}

/* ============================================================
   build the member set deterministically from params + state,
   packing each member's reaction pose from wave + phase.
   ============================================================ */
function poseFor(phase, a, px, side, feat){
  // a = local activation 0..1 (how far the wave has reached this member)
  const e = smooth(a);
  let duck=0, leanX=0, headTurn=0, lookUp=0, armMode="side", mouthOpen=0;
  switch(phase){
    case "duck":
      duck = e; lookUp = 0.35*e; armMode = e>0.4?"up":"side"; mouthOpen = 0.4*e;
      break;
    case "stare":
      lookUp = e; duck = 0.10*(1-e); armMode = e>0.5?"brow":"side"; mouthOpen = 0.25*e;
      headTurn = 0;
      break;
    case "murmur":
      // neighbours turn toward each other and cup a hand at the mouth
      headTurn = (side>0?-1:1)*0.7*e; leanX = (side>0?-1:1)*feat.wob*0.10*e;
      armMode = e>0.5?"mouth":"side"; mouthOpen = e; lookUp = 0.15*(1-e);
      break;
    case "divide":
      // split: left half leans/looks left, right half leans/looks right; gap opens
      { const d = (px<0.5?-1:1);
        leanX = d*0.11*e*0 /*placeholder scaled by s later*/;
        headTurn = d*0.85*e; armMode = e>0.5?"out":"side"; mouthOpen = 0.5*e;
        return { duck:0, leanX:d, headTurn, lookUp:0, armMode, mouthOpen, divSide:d, split:e };
      }
    default: break;
  }
  return { duck, leanX, headTurn, lookUp, armMode, mouthOpen, divSide:(px<0.5?-1:1), split:0 };
}

function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const wave = clamp01(p.wave);
  const lag  = clamp01(p.waveLag);
  const attention = clamp01(p.attention);
  const phase = p.phase || "stare";
  const rows = p.formation==="cluster" ? 3 : Math.max(1, p.rows|0);
  const perRow = p.perRow || [9,7,5];

  const members = [];
  for (let r=0; r<rows; r++){
    const depth = rows>1 ? r/(rows-1) : 0;                 // 0=back .. 1=front
    const n = perRow[Math.min(r, perRow.length-1)] || (9-2*r);
    const scale = lerp(150, 250, depth);                    // back small, front large
    const rowY  = H*(0.50 + depth*(p.groundY-0.50));
    const marginX = lerp(0.16, 0.07, depth);
    const stagger = (r%2)*0.5;
    for (let i=0;i<n;i++){
      const t  = n>1 ? (i+stagger)/(n-1+stagger) : 0.5;
      const px = clamp01(lerp(marginX, 1-marginX, clamp01(t)));
      const rng = rnd((r*131+i*17+7)>>>0);
      const feat = { beard: rng()<0.45, hair: rng()<0.16?"bald":"full",
                     headS: 0.9+rng()*0.22, wob: rng()<0.5?-1:1 };

      // reaction-wave: leftmost members activate first, rightmost lag behind
      const spread = 0.15 + lag*0.85;
      const a = clamp01((wave*(1+spread) - px*spread) / (1 - 0*spread));
      const pose = poseFor(phase, a, px, feat.wob, feat);

      // formation placement
      let cx = W*px;
      let by = rowY;
      if (p.formation==="arc") by = rowY + Math.sin(clamp01(t)*Math.PI)*scale*0.10;
      if (p.formation==="cluster"){ cx += (rng()-0.5)*scale*0.35; by += (rng()-0.5)*scale*0.10; }

      // divide phase opens a central rift and leans the two factions apart
      const leanPx = pose.leanX * scale * 0.10;
      if (phase==="divide"){ cx += pose.divSide * pose.split * scale * 0.22; }

      members.push({
        cx, baseY:by, s:scale, depth, px,
        duck:pose.duck, leanX:leanPx, headTurn:pose.headTurn, lookUp:pose.lookUp,
        armMode:pose.armMode, mouthOpen:pose.mouthOpen, divSide:pose.divSide,
        faceSide: pose.headTurn>=0?1:-1,
        act:a, feat,
        shade:{
          tunic: Math.round(lerp(2, 4, depth)) + (i%2===0?0:1),
          skin:  Math.round(lerp(2, 3, depth)),
          leg:   Math.round(lerp(3, 4, depth)),
          hair:  Math.round(lerp(4, 6, depth)),
        },
      });
    }
  }
  return { members, wave, lag, attention, phase,
           showOmen:p.showOmen, showRays:p.showRays,
           omen:{ x:W*0.5, y:H*0.14, s:W*0.055 } };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);

  // faint ground rules under the crowd (reads as the assembly floor)
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.22;
  for (let k=0;k<=3;k++){ const y=H*(0.52+k*0.11); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha=1;

  // omen overhead
  if (B.showOmen) drawOmen(pen, B.omen.x, B.omen.y, B.omen.s, B.attention);

  // faint attention RAYS from the omen down into the ranks (the upward pull)
  if (B.showRays && B.attention>0.05){
    g.strokeStyle=INK; g.lineCap="round";
    for (let i=0;i<7;i++){
      const fx = lerp(W*0.14, W*0.86, i/6);
      g.globalAlpha = 0.10*B.attention;
      g.lineWidth = 2;
      g.beginPath(); g.moveTo(B.omen.x, B.omen.y+B.omen.s*0.4); g.lineTo(fx, H*0.55); g.stroke();
    }
    g.globalAlpha=1;
  }

  // the WAVE FRONT — a faint vertical marker sweeping the crowd (reaction ripple)
  {
    const wx = lerp(W*0.05, W*0.95, B.wave);
    g.strokeStyle=ACCENT; g.globalAlpha=0.28; g.lineWidth=Math.max(2,W*0.006);
    g.setLineDash([W*0.012, W*0.02]);
    g.beginPath(); g.moveTo(wx, H*0.34); g.lineTo(wx, H*0.94); g.stroke();
    g.setLineDash([]); g.globalAlpha=1;
  }

  // members already ordered back -> front
  const heads = B.members.map(m => drawCitizen(pen, m));

  // per-phase overlays that make the collective read clearly
  if (B.phase==="murmur"){
    // little concentric murmur ripples above the most-activated heads
    g.strokeStyle=INK; g.lineCap="round";
    heads.forEach(h=>{ if (h.act>0.55){
      g.globalAlpha=0.35*h.act;
      for (let q=1;q<=2;q++){ g.lineWidth=1.5; g.beginPath();
        g.arc(h.head.x+h.r*0.5, h.head.y-h.r*0.4, h.r*0.35*q, -2.4, -0.7); g.stroke(); }
    }});
    g.globalAlpha=1;
  }
  if (B.phase==="divide"){
    // two group brackets under the split factions + opposing arrows
    g.strokeStyle=ACCENT; g.lineWidth=Math.max(2,W*0.005); g.globalAlpha=0.7;
    const by=H*0.955;
    const bracket=(x0,x1,dir)=>{
      g.beginPath(); g.moveTo(x0, by-8); g.lineTo(x0, by); g.lineTo(x1, by); g.lineTo(x1, by-8); g.stroke();
      const ax=(x0+x1)/2;
      g.beginPath(); g.moveTo(ax, by+4); g.lineTo(ax+dir*W*0.05, by+4);
      g.lineTo(ax+dir*W*0.035, by-2); g.moveTo(ax+dir*W*0.05, by+4); g.lineTo(ax+dir*W*0.035, by+10); g.stroke();
    };
    bracket(W*0.06, W*0.44, -1);
    bracket(W*0.56, W*0.94,  1);
    g.globalAlpha=1;
  }
}

export const asset = {
  id:"ensemble.assembly-reaction-wave",
  type:"ENSEMBLE",
  name:"Assembly reaction wave",
  statusWord:"STIRRED",
  scene:"OD-B02-S03",

  params,
  // back -> front draw order the ensemble honors
  layers:["ground","omen","rays","wave-front","back-row","mid-row","front-row","overlay"],
  // normalized 0..1 anchors: the omen source, wave poles, placement handles
  anchors:{
    "omen:sign":{x:.50,y:.14}, "wave:start":{x:.05,y:.64}, "wave:end":{x:.95,y:.64},
    "faction:left":{x:.25,y:.70}, "faction:right":{x:.75,y:.70},
    "row:back":{x:.50,y:.50}, "row:front":{x:.50,y:.86},
    "center":{x:.50,y:.68}, "camera:wide":{x:.50,y:.54},
  },
  zones:{ crowd:{ x0:.04,y0:.46,x1:.96,y1:.94 }, rift:{ x0:.44,y0:.52,x1:.56,y1:.94 } },
  states:{
    initial:"ducking",
    nodes:{
      // the wave of ducking sweeps the ranks as the shadow crosses over
      ducking:  { preview:{ phase:"duck",   wave:0.55, waveLag:0.8, attention:0.7, status:"DUCKING" } },
      // heads come up and fix on the sign overhead
      staring:  { preview:{ phase:"stare",  wave:0.7,  waveLag:0.6, attention:1.0, status:"STARING" } },
      // the crowd breaks into murmur, neighbour to neighbour
      murmuring:{ preview:{ phase:"murmur", wave:0.85, waveLag:0.7, attention:0.4, status:"MURMURING" } },
      // divided into two leaning factions over competing readings
      dividing: { preview:{ phase:"divide", wave:1.0,  waveLag:0.4, attention:0.3, formation:"rows", status:"DIVIDED" } },
    },
    edges:[
      ["ducking","staring"],["staring","murmuring"],["murmuring","dividing"],
      ["dividing","staring"],["staring","ducking"],
    ],
  },
  channels:["wave","waveLag","phase","attention","density","formation","depth"],

  // neutral preview = heads up, staring at the sign with the wave mid-sweep
  preview:()=>({ phase:"stare", wave:0.65, waveLag:0.6, attention:0.9, formation:"rows",
                 status:"STIRRED", progress:0.4 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
