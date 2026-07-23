/* ensemble.surviving-crew — the single-ship remnant, dividing by lot.
   ENSEMBLE asset. Scene function (OD-B10-S03): after the losses, only ONE
   ship's company remains. On Circe's shore Odysseus splits the survivors into
   two EQUAL operational groups and casts lots to decide who scouts inland.
   Built from ONE separable member template (drawSailor — a weary tunic'd
   oarsman) instanced deterministically into TWO equal clusters across depth.
   Exposes a FORMATION channel (assembled | two-groups | lots), a SPLIT control
   (0 = one body .. 1 = two divided companies), a WEARY channel (0 upright ..
   1 slumped, heads bowed, spent), an ATTENTION channel (0 loose .. 1 every head
   turned to the lot-helmet between the groups), plus spread + density. Drawn in
   SOLID grays + hard contour into the offscreen ctx; the engine dotify POST
   pass supplies the halftone. Do NOT bake named heroes in — anonymous crew.
   Atlas OD-B10-S03. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

const params = {
  formation:"lots",        // assembled | two-groups | lots
  perGroup:6,              // members per company (two EQUAL groups -> 2*perGroup)
  split:1.0,               // 0 = merged single body .. 1 = two fully separated companies
  weary:0.72,              // 0 upright/rested .. 1 slumped shoulders, heads bowed
  attention:0.78,          // 0 loose .. 1 every head turned to the lot-helmet
  spread:1.0,              // width within each company
  density:1.0,             // 0 near band only .. 1 full company depth
  gap:0.235,               // half-distance between the two company centres (frac W)
  showLots:true,           // the bronze lot-helmet in the divide + drawing arms
  horizon:0.36,            // sea/sky line as fraction of H
  shoreLevel:0.50,         // waterline / beach line as fraction of H
  ship:true,               // the beached single-ship remnant at back centre
};

/* two depth bands per company: [far, near]. footline + member height + tunic
   ink (nearer = larger + darker so the two ranks read against the pale beach). */
const BAND_Y   = [0.615, 0.820];
const BAND_S   = [150, 214];
const BAND_LVL = [4, 5];

/* member layout WITHIN one company: gx = normalized offset (-1..1) about the
   company centre; band = depth rank; lead = the member who draws the lot. */
const GROUP_LAYOUT = [
  { gx:-0.62, band:0 }, { gx: 0.00, band:0 }, { gx: 0.62, band:0 },
  { gx:-0.78, band:1 }, { gx: 0.10, band:1, lead:true }, { gx: 0.86, band:1 },
];

/* ============================================================
   MEMBER TEMPLATE — one weary oarsman, drawn deterministically.
   cx/footY/s in px. o = { flip, lvl, weary, headDX, arm, seed }.
   arm: "rest" (hands low) | "draw" (near hand reaches toward the lot-helmet).
   ============================================================ */
function drawSailor(pen, g, cx, footY, s, o){
  const cloth = toneSolid(inkLevel(o.lvl));
  const skin  = toneSolid(inkLevel(2));
  const limbT = toneSolid(inkLevel(3));
  const hair  = toneSolid(inkLevel(6));
  const cw    = Math.max(3, s*0.020);
  const F     = o.flip;
  const weary = clamp01(o.weary);
  const R     = rnd(o.seed);
  const jit   = (R()-0.5)*s*0.045;               // per-member jitter so the crew differ

  // ---- body metrics: weariness sinks shoulders, bows the head, rounds the back
  const hemY      = footY - s*0.135;             // tunic hem above the ankles
  const torsoH    = s*0.50*(1-0.05*weary);
  const shoulderY = hemY - torsoH + weary*s*0.03;
  const shoulderW = s*0.30*(1-0.10*weary);
  const hemW      = s*0.40;
  const headR     = s*0.135;
  const bow       = weary*s*0.06;                // head bows forward + down
  const headCy    = shoulderY - headR*(1.02-0.14*weary);
  const hx        = cx + F*bow*0.5 + o.headDX + jit;
  const hy        = headCy + bow;

  // ---- ground shadow
  g.fillStyle = "rgba(0,0,0,0.12)";
  g.beginPath(); g.ellipse(cx, footY+s*0.012, hemW*0.62, s*0.038, 0,0,7); g.fill();

  // ---- legs (a tired, narrow stance) + sandalled feet
  pen.limb(()=>{ g.moveTo(cx-hemW*0.19,hemY); g.lineTo(cx-hemW*0.24,footY); }, limbT, cw*2.1);
  pen.limb(()=>{ g.moveTo(cx+hemW*0.19,hemY); g.lineTo(cx+hemW*0.24,footY); }, limbT, cw*2.1);
  pen.paint(()=>{ g.ellipse(cx-hemW*0.24,footY,s*0.055,s*0.024,0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);
  pen.paint(()=>{ g.ellipse(cx+hemW*0.24,footY,s*0.055,s*0.024,0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);

  // ---- BACK arm (behind torso), hanging heavy at the side
  const backSh = { x:cx-F*shoulderW*0.45, y:shoulderY+s*0.04 };
  drawArm(pen,g, backSh, { el:{x:-F*0.16,y:0.9}, wr:{x:-F*0.10,y:1.0} }, s, cloth, limbT, cw);

  // ---- TORSO tunic (blocky trapezoid, a slight forward round when weary)
  pen.paint(()=>{
    g.moveTo(cx-shoulderW/2+F*bow*0.3, shoulderY);
    g.lineTo(cx+shoulderW/2+F*bow*0.3, shoulderY);
    g.lineTo(cx+hemW/2, hemY);
    g.lineTo(cx-hemW/2, hemY);
    g.closePath();
  }, cloth, cw);
  // belt + a vertical fold seam
  pen.seam(()=>{ g.moveTo(cx-shoulderW*0.5, shoulderY+torsoH*0.52); g.lineTo(cx+shoulderW*0.5, shoulderY+torsoH*0.52); }, cw*0.7);
  pen.seam(()=>{ g.moveTo(cx+F*bow*0.15, shoulderY+torsoH*0.55); g.lineTo(cx, hemY); }, cw*0.55);

  // ---- NECK + HEAD (bowed)
  pen.limb(()=>{ g.moveTo(cx, shoulderY+s*0.005); g.lineTo(hx, hy+headR*0.7); }, skin, s*0.05);
  pen.paint(()=>{ g.arc(hx, hy, headR, 0,7); }, skin, cw);
  // hair cap over the crown (back half)
  pen.paint(()=>{ g.arc(hx, hy-headR*0.05, headR*1.02, Math.PI*1.0, Math.PI*2.0); }, hair, cw*0.8);

  // ---- FACE (weariness reads here: heavy lids, level brows, set mouth)
  drawFace(pen,g, hx, hy, headR, weary);

  // ---- FRONT arm — either resting low, or reaching to draw a lot
  const frontSh = { x:cx+F*shoulderW*0.45, y:shoulderY+s*0.04 };
  if (o.arm==="draw"){
    const a = drawArm(pen,g, frontSh, { el:{x:F*0.7,y:0.15}, wr:{x:F*0.95,y:0.02} }, s, cloth, limbT, cw);
    // a small marked lot pinched between the fingers
    pen.paint(()=>{ g.arc(a.wr.x+F*s*0.03, a.wr.y, s*0.028, 0,7); }, toneSolid(inkLevel(5)), cw*0.7);
    pen.seam(()=>{ g.moveTo(a.wr.x+F*s*0.02, a.wr.y-s*0.012); g.lineTo(a.wr.x+F*s*0.04, a.wr.y+s*0.012); }, cw*0.5);
  } else {
    drawArm(pen,g, frontSh, { el:{x:F*0.2,y:0.88}, wr:{x:F*0.08,y:1.0} }, s, cloth, limbT, cw);
  }
}

/* two-segment arm from a shoulder toward {elbow,wrist} unit directions */
function drawArm(pen,g, sh, dirs, s, tone, skinT, cw){
  const n = v => { const m=Math.hypot(v.x,v.y)||1; return {x:v.x/m,y:v.y/m}; };
  const e = n(dirs.el), w = n(dirs.wr);
  const L1=s*0.150, L2=s*0.145;
  const el={ x:sh.x+e.x*L1, y:sh.y+e.y*L1 };
  const wr={ x:el.x+w.x*L2, y:el.y+w.y*L2 };
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(el.x,el.y); }, tone, s*0.052);
  pen.limb(()=>{ g.moveTo(el.x,el.y); g.lineTo(wr.x,wr.y); }, skinT, s*0.044);
  pen.paint(()=>{ g.arc(wr.x,wr.y, s*0.030, 0,7); }, skinT, cw*0.7);
  return { el, wr };
}

function drawFace(pen,g, hx, hy, headR, weary){
  const eyeY = hy - headR*0.04;
  const edx  = headR*0.34;
  g.strokeStyle=INK; g.lineCap="round";
  if (weary>0.45){
    // heavy half-closed lids — a downward arc for each eye
    g.lineWidth=Math.max(2, headR*0.13);
    g.beginPath(); g.moveTo(hx-edx-headR*0.14, eyeY); g.quadraticCurveTo(hx-edx, eyeY+headR*0.14, hx-edx+headR*0.14, eyeY); g.stroke();
    g.beginPath(); g.moveTo(hx+edx-headR*0.14, eyeY); g.quadraticCurveTo(hx+edx, eyeY+headR*0.14, hx+edx+headR*0.14, eyeY); g.stroke();
  } else {
    g.fillStyle=INK;
    g.beginPath(); g.ellipse(hx-edx, eyeY, headR*0.11, headR*0.13, 0,0,7); g.fill();
    g.beginPath(); g.ellipse(hx+edx, eyeY, headR*0.11, headR*0.13, 0,0,7); g.fill();
  }
  // brows — level, slightly pinched inward when weary
  const bl = headR*(0.26 + 0.10*weary);
  g.lineWidth=Math.max(2, headR*0.11);
  g.beginPath(); g.moveTo(hx-edx-headR*0.16, eyeY-bl*0.7); g.lineTo(hx-edx+headR*0.16, eyeY-bl*(0.6-0.2*weary)); g.stroke();
  g.beginPath(); g.moveTo(hx+edx-headR*0.16, eyeY-bl*(0.6-0.2*weary)); g.lineTo(hx+edx+headR*0.16, eyeY-bl*0.7); g.stroke();
  // nose tick
  g.lineWidth=Math.max(2, headR*0.08);
  g.beginPath(); g.moveTo(hx, eyeY+headR*0.10); g.lineTo(hx, eyeY+headR*0.34); g.stroke();
  // mouth — a spent, slightly downturned line
  const my = hy + headR*0.46;
  g.lineWidth=Math.max(2, headR*0.10);
  g.beginPath(); g.moveTo(hx-headR*0.20, my-weary*headR*0.03);
  g.quadraticCurveTo(hx, my+weary*headR*0.10, hx+headR*0.20, my-weary*headR*0.03); g.stroke();
}

/* ---- the bronze lot-helmet in the divide, marked pebbles heaped inside ---- */
function drawLotHelmet(pen,g, cx, cy, s){
  const bowl = toneSolid(inkLevel(5));
  const rim  = toneSolid(inkLevel(6));
  const w = s*0.42, h = s*0.24;
  // helmet bowl (inverted dome sitting on the sand)
  pen.paint(()=>{ g.ellipse(cx, cy, w, h, 0, 0, Math.PI); }, bowl, Math.max(3,s*0.02));
  pen.paint(()=>{ g.moveTo(cx-w, cy); g.quadraticCurveTo(cx, cy-h*0.55, cx+w, cy); g.closePath(); }, rim, Math.max(3,s*0.02));
  // a heap of marked lots inside
  const lot = toneSolid(inkLevel(3));
  for(let i=-1;i<=1;i++){ pen.paint(()=>{ g.arc(cx+i*w*0.34, cy-h*0.12-Math.abs(i)*h*0.06, s*0.05, 0,7); }, lot, Math.max(2,s*0.015)); }
  pen.seam(()=>{ g.moveTo(cx-w*0.34, cy-h*0.16); g.lineTo(cx-w*0.34+s*0.03, cy-h*0.16+s*0.03); }, Math.max(2,s*0.012));
}

/* ---- a small beached single-ship remnant behind the crew (the last hull) ---- */
function drawBeachedShip(pen,g, cx, cy, s){
  const hull = toneSolid(inkLevel(4));
  const sail = toneSolid(inkLevel(2));
  const cw   = Math.max(1.6, s*0.045);
  const hh   = s*0.34;
  const sheer= cy - hh*0.12;
  pen.paint(()=>{
    g.moveTo(cx-s, sheer); g.lineTo(cx+s, sheer);
    g.quadraticCurveTo(cx+s*0.55, cy+hh, cx, cy+hh*1.05);
    g.quadraticCurveTo(cx-s*0.55, cy+hh, cx-s, sheer);
    g.closePath();
  }, hull, cw);
  // recurved stem + stern posts
  pen.ink(()=>{ g.moveTo(cx+s, sheer); g.quadraticCurveTo(cx+s*1.12, sheer-hh*1.2, cx+s*0.88, sheer-hh*1.75); }, cw*1.1);
  pen.ink(()=>{ g.moveTo(cx-s, sheer); g.quadraticCurveTo(cx-s*1.05, sheer-hh*0.95, cx-s*0.82, sheer-hh*1.3); }, cw*1.1);
  // mast + brailed (furled) sail — she is drawn up, not sailing
  const mastTop = sheer - s*1.15;
  pen.ink(()=>{ g.moveTo(cx, sheer-hh*0.05); g.lineTo(cx, mastTop); }, cw*1.05);
  const yardW=s*0.55, yy=mastTop+s*0.14;
  pen.paint(()=>{ g.moveTo(cx-yardW, yy); g.lineTo(cx+yardW, yy); g.lineTo(cx+yardW*0.7, yy+s*0.16); g.lineTo(cx-yardW*0.7, yy+s*0.16); g.closePath(); }, sail, cw);
}

/* ---- build the two equal companies deterministically ---- */
function buildCrew(W, H, st){
  const p = { ...params, ...st };
  const split   = clamp01(p.split);
  const weary   = clamp01(p.weary);
  const attention = clamp01(p.attention);
  const spread  = clamp(p.spread, 0.4, 1.6);
  const density = clamp01(p.density);
  const gap     = p.gap;
  const centreX = 0.5*W, lotY = BAND_Y[1]*H - BAND_S[1]*0.02;

  const layout = GROUP_LAYOUT.filter(m => density>=1 ? true : m.band>=1);

  const members = [];
  for (const grp of [-1, 1]){                    // -1 = left company, +1 = right company
    const groupCX = (0.5 + grp*gap*split) * W;
    const gw = W*0.115;
    layout.forEach((m, i)=>{
      const footY = BAND_Y[m.band]*H;
      const s     = BAND_S[m.band];
      const lvl   = BAND_LVL[m.band];
      const px    = clamp(groupCX + m.gx*gw*spread, W*0.05, W*0.95);
      // attention turns every head toward the central lot-helmet (bounded)
      const headDX = clamp((centreX - px)*0.09*attention, -s*0.10, s*0.10);
      // the lead of each company reaches to draw a lot when the lots are out
      const drawing = m.lead && p.showLots && split>0.25;
      members.push({
        cx:px, footY, s, lvl,
        flip: grp,                               // companies face inward toward the divide
        weary: clamp01(weary + (i%2?0.06:-0.05)),
        headDX,
        arm: drawing ? "draw" : "rest",
        seed: 2200 + (grp>0?500:0) + i*61,
        band:m.band,
      });
    });
  }
  members.sort((a,b)=> a.footY - b.footY);        // paint far (high) -> near (low)
  return { members, centreX, lotY, split, showLots:p.showLots };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const p = { ...params, ...st };
  const horY   = p.horizon*H;
  const shoreY = p.shoreLevel*H;
  const { members, centreX, lotY, split, showLots } = buildCrew(W, H, st);

  // ---- SKY (lightest) ----
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horY);
  g.fillStyle = inkLevel(2);
  for (let i=0;i<5;i++){ g.beginPath(); g.ellipse(W*(0.14+i*0.19), horY*(0.55+0.06*(i%2)), W*0.10, H*0.020, 0,0,7); g.fill(); }

  // ---- SEA band between sky and shore ----
  pen.ink(()=>{ g.moveTo(0,horY); g.lineTo(W,horY); }, 3);
  g.fillStyle = inkLevel(3); g.fillRect(0,horY,W,shoreY-horY);
  g.strokeStyle=INK; g.globalAlpha=0.30;
  for (let j=1;j<=3;j++){
    const y = horY + (shoreY-horY)*(j/3.4);
    g.lineWidth=1+j*0.3; g.beginPath();
    for (let x=0;x<=W;x+=W*0.04){ const yy=y+Math.sin(x*0.05+j)*(2+j*0.5); x===0?g.moveTo(x,yy):g.lineTo(x,yy); }
    g.stroke();
  }
  g.globalAlpha=1;

  // ---- BEACH (palest, so the dark crew read) ----
  g.fillStyle = inkLevel(1); g.fillRect(0,shoreY,W,H-shoreY);
  // waterline scallop
  pen.ink(()=>{ g.moveTo(0,shoreY); for(let x=0;x<=W;x+=W*0.05){ g.lineTo(x, shoreY+Math.sin(x*0.06)*3); } }, 2);

  // ---- the beached single-ship REMNANT at back centre ----
  if (p.ship) drawBeachedShip(pen,g, centreX, shoreY+H*0.045, 118);

  // ---- the DIVIDE: a scored line in the sand between the two companies ----
  if (split>0.15){
    g.strokeStyle=INK; g.globalAlpha=0.45; g.setLineDash([4,10]); g.lineWidth=3;
    g.beginPath(); g.moveTo(centreX, shoreY+H*0.09); g.lineTo(centreX, H*0.965); g.stroke();
    g.setLineDash([]); g.globalAlpha=1;
    // two divergent group markers (blue) left + right of the divide
    g.fillStyle=ACCENT; g.globalAlpha=0.8;
    g.fillRect(centreX - W*(0.5*p.gap*split) - 5, shoreY+H*0.05, 10,10);
    g.fillRect(centreX + W*(0.5*p.gap*split) - 5, shoreY+H*0.05, 10,10);
    g.globalAlpha=1;
  }

  // ---- the crew, painted far -> near ----
  for (const m of members) drawSailor(pen, g, m.cx, m.footY, m.s, m);

  // ---- the bronze lot-helmet in the divide (drawn over the near rank) ----
  if (showLots && split>0.25) drawLotHelmet(pen,g, centreX, lotY, 150);
}

export const asset = {
  id:"ensemble.surviving-crew",
  type:"ENSEMBLE",
  name:"Surviving crew",
  statusWord:"WEARY",
  scene:"OD-B10-S03",

  params,
  // ONE separable sailor template, instanced into TWO equal companies
  member:{ template:"drawSailor", perGroup:params.perGroup, groups:["left-company","right-company"], layout:"GROUP_LAYOUT" },
  // back -> front draw order the ensemble honors
  layers:["sky","sea","beach","ship-remnant","divide","company-far","company-near","lot-helmet"],
  // normalized 0..1 anchors: the two company musters, the divide + lot focus
  anchors:{
    "company:left":{x:.27,y:.80}, "company:right":{x:.73,y:.80},
    "divide:line":{x:.50,y:.72}, "lots:helmet":{x:.50,y:.80},
    "remnant:ship":{x:.50,y:.55},
    "muster:far":{x:.50,y:.615}, "muster:near":{x:.50,y:.820},
    "entrance:inland":{x:.50,y:.40}, "exit:left":{x:.05,y:.90}, "exit:right":{x:.95,y:.90},
    "camera:wide":{x:.50,y:.58}, "camera:divide":{x:.50,y:.74},
  },
  // walkable beach region for scene placement / pathing
  zones:{ beach:{ x0:.04,y0:.52,x1:.96,y1:.96 }, divide:{ x0:.46,y0:.60,x1:.54,y1:.96 } },
  channels:["formation","split","weary","attention","spread","density"],
  states:{
    initial:"lots",
    nodes:{
      // still one company, massed together on the shore, spent from the sea
      assembled:  { preview:{ formation:"assembled", split:0.14, weary:0.80, attention:0.30, showLots:false, status:"SPENT" } },
      // the survivors told off into two equal bodies, a gap opening between
      "two-groups":{ preview:{ formation:"two-groups", split:1.0, weary:0.66, attention:0.55, showLots:false, status:"DIVIDED" } },
      // lots cast in the helmet to choose which company scouts inland
      lots:       { preview:{ formation:"lots", split:1.0, weary:0.72, attention:0.85, showLots:true, status:"DRAWING LOTS" } },
    },
    // the scene arc: land spent -> divide into two -> cast the lots
    edges:[["assembled","two-groups"],["two-groups","lots"],["assembled","lots"]],
  },

  // neutral preview = the survivors split into two companies, drawing lots
  preview:()=>({ formation:"lots", split:1.0, weary:0.72, attention:0.85, spread:1.0, density:1.0, showLots:true, status:"WEARY", progress:0.52 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
