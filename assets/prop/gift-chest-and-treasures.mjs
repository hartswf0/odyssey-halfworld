/* prop.gift-chest-and-treasures — the Phaeacian guest-gifts: a banded wooden
   treasure chest that holds/spills a hoard of bronze tripods, gold cups and
   folded cloth. PROP asset. Drawn in SOLID grays + hard contour into the
   offscreen ctx; the engine dotify pass supplies the halftone. Do NOT
   pre-dither.
   Scene function (OD-B13-S01): a sealed collection object with three states —
   SEALED  (lid shut, iron clasp locked, banded box at rest),
   OPEN    (lid hinged back, dark mouth, the treasure hoard visible: two bronze
            ring-handled tripod cauldrons, a pair of gold cups, a folded cloth
            stack rising above the rim),
   CONCEALED (a draped cover thrown over the shut chest, contents hidden — the
            inventory persists underneath but reads as covered).
   The hoard is a separable inventory (bronze / gold / cloth) so a scene can
   persist it across states. Grip / lid / contact anchors + a collision box in
   0..1 space; ownership declared. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  boxW:0.54,          // chest body width (fraction of W)
  boxH:0.26,          // chest body height (fraction of H)
  lidH:0.11,          // lid dome height (fraction of H)
  bands:2,            // horizontal iron straps across the body
  planks:4,           // vertical plank seams on the front face
  tripods:2,          // bronze tripod cauldrons in the hoard
  cups:2,             // gold cups in the hoard
};

const WOOD   = 4;     // chest body (mid wood)
const WOOD2  = 5;     // shaded end panel / foot
const LIDTONE= 4;     // lid dome
const BAND   = 6;     // iron straps / clasp (near-black metal)
const MOUTH  = 6;     // open-chest interior hollow (dark)
const BRONZE = 5;     // bronze tripod cauldrons (dark metal)
const GOLD   = 3;     // gold cups (light metal)
const CLOTH  = 2;     // folded cloth stack (very light)
const DRAPE  = 3;     // concealment cover cloth

/* rounded-rect sub-path (no fill/stroke; caller wraps in pen.paint) */
function rr(g,x,y,w,h,r){
  r=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);
  g.moveTo(x+r,y);
  g.lineTo(x+w-r,y); g.arcTo(x+w,y,x+w,y+r,r);
  g.lineTo(x+w,y+h-r); g.arcTo(x+w,y+h,x+w-r,y+h,r);
  g.lineTo(x+r,y+h); g.arcTo(x,y+h,x,y+h-r,r);
  g.lineTo(x,y+r); g.arcTo(x,y,x+r,y,r);
  g.closePath();
}

/* ------------------------------------------------------------------
   ONE BRONZE TRIPOD CAULDRON — a round bowl on three splayed legs with two
   ring handles, drawn centred at (cx, rimY) with the bowl sitting ABOVE the
   rim line and the legs dropping below it (into the chest / hidden). `rise`
   0..1 lifts the whole vessel up out of the chest.
   ------------------------------------------------------------------ */
function drawTripod(pen,g,cx,rimY,s,rise){
  const cy = rimY - s*0.52*rise - s*0.22;   // bowl centre
  const rx = s*0.42, ry = s*0.30;
  // legs first (behind the bowl)
  const legTop = cy+ry*0.5, legBot = cy+ry*0.5 + s*0.62;
  for(const dx of [-s*0.30, 0, s*0.30]){
    pen.limb(()=>{ g.moveTo(cx+dx*0.3, legTop); g.lineTo(cx+dx, legBot); }, toneSolid(inkLevel(BRONZE+1)), s*0.06);
  }
  // ring handles (two loops flanking the rim)
  for(const sgn of [-1,1]){
    pen.paint(()=>{ g.ellipse(cx+sgn*rx*1.02, cy-ry*0.55, s*0.10, s*0.13, 0, 0, 7); }, toneSolid(inkLevel(BRONZE)), 4);
    pen.paint(()=>{ g.ellipse(cx+sgn*rx*1.02, cy-ry*0.55, s*0.05, s*0.08, 0, 0, 7); }, toneSolid(inkLevel(1)), 3);
  }
  // cauldron bowl (hemisphere)
  pen.paint(()=>{
    g.moveTo(cx-rx, cy-ry*0.2);
    g.quadraticCurveTo(cx-rx*0.95, cy+ry*1.15, cx, cy+ry*1.25);
    g.quadraticCurveTo(cx+rx*0.95, cy+ry*1.15, cx+rx, cy-ry*0.2);
    g.ellipse(cx, cy-ry*0.2, rx, ry*0.42, 0, 0, Math.PI, true);
    g.closePath();
  }, toneSolid(inkLevel(BRONZE)), 5);
  // rim mouth (dark ellipse) + a girdle seam
  pen.paint(()=>{ g.ellipse(cx, cy-ry*0.2, rx, ry*0.42, 0, 0, 7); }, toneSolid(inkLevel(BRONZE+1)), 3);
  pen.seam(()=>{ g.ellipse(cx, cy+ry*0.35, rx*0.9, ry*0.5, 0, 0.15, Math.PI-0.15); }, 2.5);
}

/* ONE GOLD CUP — a shallow two-handled kylix on a short stemmed foot. */
function drawCup(pen,g,cx,rimY,s,rise){
  const cy = rimY - s*0.42*rise - s*0.06;
  const rx = s*0.30, ry = s*0.15;
  // foot + stem
  pen.limb(()=>{ g.moveTo(cx, cy+ry*0.6); g.lineTo(cx, cy+ry*1.7); }, toneSolid(inkLevel(GOLD+1)), s*0.05);
  pen.paint(()=>{ g.ellipse(cx, cy+ry*1.8, rx*0.55, ry*0.4, 0, 0, 7); }, toneSolid(inkLevel(GOLD+1)), 3);
  // handles
  for(const sgn of [-1,1]){
    pen.limb(()=>{ g.moveTo(cx+sgn*rx*0.85, cy-ry*0.2); g.quadraticCurveTo(cx+sgn*rx*1.45, cy, cx+sgn*rx*0.85, cy+ry*0.55); }, toneSolid(inkLevel(GOLD+1)), s*0.035);
  }
  // shallow bowl
  pen.paint(()=>{
    g.moveTo(cx-rx, cy-ry*0.4);
    g.quadraticCurveTo(cx, cy+ry*1.05, cx+rx, cy-ry*0.4);
    g.ellipse(cx, cy-ry*0.4, rx, ry*0.5, 0, 0, Math.PI, true);
    g.closePath();
  }, toneSolid(inkLevel(GOLD)), 4);
  pen.paint(()=>{ g.ellipse(cx, cy-ry*0.4, rx, ry*0.5, 0, 0, 7); }, toneSolid(inkLevel(GOLD+1)), 3);
}

/* FOLDED CLOTH STACK — a short stack of folded textiles with fold seams. */
function drawCloth(pen,g,cx,rimY,w,rise){
  const n=3, hh=w*0.16;
  const topY = rimY - w*0.34*rise;
  for(let i=n-1;i>=0;i--){
    const y = topY - i*hh*0.82;
    const ww = w*(1 - i*0.06);
    pen.paint(()=>{ rr(g, cx-ww/2, y-hh, ww, hh, hh*0.32); }, toneSolid(inkLevel(CLOTH + (i%2))), 4);
    // fold seam down the middle + edge tick
    pen.seam(()=>{ g.moveTo(cx, y-hh*0.85); g.lineTo(cx, y-hh*0.15); }, 2);
    pen.seam(()=>{ g.moveTo(cx-ww*0.5+hh*0.32, y-hh*0.5); g.lineTo(cx+ww*0.5-hh*0.32, y-hh*0.5); }, 1.5);
  }
}

/* ------------------------------------------------------------------
   THE CHEST BODY — banded wooden box resting on the ground, front elevation.
   ------------------------------------------------------------------ */
function chestGeometry(W,H){
  const cx = W*0.5, groundY = H*0.82;
  const bw = W*params.boxW, bh = H*params.boxH;
  return { cx, groundY, bw, bh,
    left:cx-bw/2, right:cx+bw/2, top:groundY-bh, bottom:groundY,
    lidH:H*params.lidH };
}

function drawBody(pen,g,C){
  const { cx, left, right, top, bottom, bw, bh } = C;
  // ---- little feet ----
  const fw=bw*0.10, fh=bh*0.10;
  pen.paint(()=>{ rr(g, left+bw*0.05, bottom-fh*0.2, fw, fh, 3); }, toneSolid(inkLevel(WOOD2)), 4);
  pen.paint(()=>{ rr(g, right-bw*0.05-fw, bottom-fh*0.2, fw, fh, 3); }, toneSolid(inkLevel(WOOD2)), 4);
  // ---- box front face ----
  pen.paint(()=>{ rr(g, left, top, bw, bh, bh*0.05); }, toneSolid(inkLevel(WOOD)), 6);
  // vertical plank seams
  for(let i=1;i<params.planks;i++){
    const x = left + bw*(i/params.planks);
    pen.seam(()=>{ g.moveTo(x, top+bh*0.06); g.lineTo(x, bottom-bh*0.06); }, 2.5);
  }
  // ---- iron corner straps ----
  const cs=bw*0.05;
  for(const sx of [left, right-cs]){
    pen.paint(()=>{ g.rect(sx, top, cs, bh); }, toneSolid(inkLevel(BAND)), 3);
  }
  // ---- horizontal iron bands ----
  for(let i=1;i<=params.bands;i++){
    const y = top + bh*(i/(params.bands+1)) - bh*0.03;
    pen.paint(()=>{ g.rect(left, y, bw, bh*0.06); }, toneSolid(inkLevel(BAND)), 3);
  }
}

/* iron clasp/lock plate on the front centre of the lid seam (SEALED only) */
function drawClasp(pen,g,C){
  const { cx, top } = C;
  const cw=C.bw*0.10, ch=C.bh*0.24;
  pen.paint(()=>{ rr(g, cx-cw/2, top-ch*0.35, cw, ch, cw*0.18); }, toneSolid(inkLevel(BAND)), 3);
  // keyhole
  g.fillStyle=inkLevel(1); g.beginPath(); g.arc(cx, top+ch*0.15, cw*0.14, 0, 7); g.fill();
  g.fillRect(cx-cw*0.05, top+ch*0.15, cw*0.10, ch*0.28);
}

/* THE CLOSED LID — a domed banded cap sitting on the box, bottom edge at
   (top-of-box). Drawn in world space centred on cx. */
function drawClosedLid(pen,g,cx,edgeY,bw,lidH){
  const hw=bw/2, y0=edgeY;
  pen.paint(()=>{
    g.moveTo(cx-hw, y0);
    g.lineTo(cx-hw, y0-lidH*0.35);
    g.quadraticCurveTo(cx-hw, y0-lidH, cx, y0-lidH);
    g.quadraticCurveTo(cx+hw, y0-lidH, cx+hw, y0-lidH*0.35);
    g.lineTo(cx+hw, y0);
    g.closePath();
  }, toneSolid(inkLevel(LIDTONE)), 6);
  // front lip band along the bottom edge
  pen.paint(()=>{ g.rect(cx-hw, y0-lidH*0.14, bw, lidH*0.16); }, toneSolid(inkLevel(BAND)), 3);
  // iron straps arching over the dome
  for(const fx of [-hw*0.5, hw*0.5]){
    pen.ink(()=>{ g.moveTo(cx+fx, y0); g.lineTo(cx+fx, y0-lidH*0.5); g.quadraticCurveTo(cx+fx, y0-lidH*0.92, cx+fx*0.5, y0-lidH); }, 4);
  }
  // corner straps
  for(const sgn of [-1,1]){
    pen.paint(()=>{ g.rect(sgn<0?cx-hw:cx+hw-bw*0.05, y0-lidH*0.35, bw*0.05, lidH*0.35+2); }, toneSolid(inkLevel(BAND)), 3);
  }
}

/* THE OPEN LID — hinged at the rear top edge and leaning back+up, seen at an
   angle so its banded outer face reads as a raised panel above the opening.
   Drawn BEHIND the hoard so treasures overlap in front of it. */
function drawOpenLid(pen,g,C){
  const cx=C.cx, hw=C.bw*0.48;
  const hinge = C.top - C.bh*0.04;             // hinge line (just above box top)
  const far   = hinge - C.bh*0.72;             // raised far edge of the lid
  const fore  = C.lidH*0.55;                    // foreshortened dome bulge
  // hinge straps from box back up to the lid base
  for(const fx of [-hw*0.55, hw*0.55]){
    pen.limb(()=>{ g.moveTo(cx+fx, hinge+C.bh*0.02); g.lineTo(cx+fx, hinge-C.bh*0.06); }, toneSolid(inkLevel(BAND)), C.bw*0.03);
  }
  // the leaning lid panel (outer face)
  pen.paint(()=>{
    g.moveTo(cx-hw, hinge);
    g.lineTo(cx-hw*0.90, far);
    g.quadraticCurveTo(cx, far-fore, cx+hw*0.90, far);
    g.lineTo(cx+hw, hinge);
    g.quadraticCurveTo(cx, hinge+fore*0.35, cx-hw, hinge);
    g.closePath();
  }, toneSolid(inkLevel(LIDTONE)), 6);
  // banded rim along the raised far edge + centre strap
  pen.ink(()=>{ g.moveTo(cx-hw*0.90, far); g.quadraticCurveTo(cx, far-fore*0.9, cx+hw*0.90, far); }, 4);
  for(const fx of [-hw*0.45, hw*0.45]){
    pen.ink(()=>{ g.moveTo(cx+fx*(hinge>far?1:1), hinge); g.lineTo(cx+fx*0.92, far+fore*0.15); }, 4);
  }
}

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const open    = clamp(st.open    ?? 0, 0, 1);   // 0 shut .. 1 lid fully back
  const conceal = clamp(st.conceal ?? 0, 0, 1);   // draped cover over the chest
  const C = chestGeometry(W,H);

  // ---- ground shadow ----
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(C.cx, C.bottom+H*0.012, C.bw*0.58, H*0.018, 0,0,7); g.fill();

  // ---- chest body ----
  drawBody(pen,g,C);

  if (open>0.5){
    // ---- OPEN: raised lid (behind) + shallow dark mouth + the treasure hoard ----
    drawOpenLid(pen,g,C);
    const rimY = C.top;
    // a shallow dark opening: thin rim ellipse + a short dark band the treasures
    // rise out of (kept small so bronze reads AGAINST the pale lid, not lost)
    pen.paint(()=>{ g.ellipse(C.cx, rimY, C.bw*0.46, C.lidH*0.26, 0,0,7); }, toneSolid(inkLevel(MOUTH)), 4);
    pen.fillPath(()=>{ g.rect(C.left+C.bw*0.06, rimY, C.bw*0.88, C.bh*0.10); }, inkLevel(MOUTH));

    // back: folded cloth stack, centre. mid: two bronze tripods flanking (their
    // dark bowls sit high against the pale lid). front: one bright gold cup.
    drawCloth (pen,g, C.cx, rimY, C.bw*0.26, open);
    drawTripod(pen,g, C.left + C.bw*0.24, rimY, C.bw*0.42, open);
    drawTripod(pen,g, C.left + C.bw*0.76, rimY, C.bw*0.42, open);
    drawCup   (pen,g, C.cx, rimY+C.bh*0.02, C.bw*0.34, open);
  } else {
    // ---- CLOSED lid sits on the box (SEALED / CONCEALED) ----
    if (conceal<0.5) drawClasp(pen,g,C);
    drawClosedLid(pen,g,C.cx,C.top,C.bw,C.lidH);
  }

  // ---- CONCEALED: a draped cover thrown over the shut chest ----
  if (conceal>0.05){
    const dl=C.left-C.bw*0.06, dr=C.right+C.bw*0.06;
    const dtop=C.top-C.lidH*0.9, dbot=C.bottom-C.bh*0.10;
    pen.paint(()=>{
      g.moveTo(dl, dbot);
      g.lineTo(dl, dtop+C.lidH*0.5);
      // draped crown over the lid dome
      g.quadraticCurveTo(dl, dtop, C.cx-C.bw*0.18, dtop);
      g.quadraticCurveTo(C.cx, dtop-C.lidH*0.35, C.cx+C.bw*0.18, dtop);
      g.quadraticCurveTo(dr, dtop, dr, dtop+C.lidH*0.5);
      g.lineTo(dr, dbot);
      // scalloped hem
      const nb=5, step=(dr-dl)/nb;
      for(let i=nb;i>=1;i--){ const x=dl+step*i; g.quadraticCurveTo(x-step*0.25, dbot+C.bh*0.06, x-step*0.5, dbot); g.quadraticCurveTo(x-step*0.75, dbot-C.bh*0.02, x-step, dbot); }
      g.closePath();
    }, toneSolid(inkLevel(DRAPE)), 6);
    // drape folds
    g.strokeStyle=inkLevel(DRAPE+2); g.lineWidth=2.5; g.lineCap="round";
    for(let i=-2;i<=2;i++){
      const x=C.cx+i*C.bw*0.16;
      g.beginPath(); g.moveTo(x, dtop+C.lidH*0.4); g.lineTo(x+i*C.bw*0.02, dbot-C.bh*0.02); g.stroke();
    }
    // crown highlight
    pen.seam(()=>{ g.moveTo(C.cx-C.bw*0.16, dtop+2); g.lineTo(C.cx+C.bw*0.16, dtop+2); }, 2);
  }
}

export const asset = {
  id:"prop.gift-chest-and-treasures",
  type:"PROP",
  name:"Gift Chest and Treasures",
  statusWord:"SEALED",
  scene:"OD-B13-S01",

  params,
  // back -> front draw order the prop honors
  layers:["shadow","body","mouth","cloth","cups","tripods","clasp","lid","drape"],
  // normalized 0..1 anchors: grip/carry, lid pivot, contacts, hoard slots
  anchors:{
    "grip:left":{x:.20,y:.68},        // side handle-grip for two-porter carry
    "grip:right":{x:.80,y:.68},
    "hinge:lid":{x:.50,y:.56},         // rear-top lid pivot
    "clasp:front":{x:.50,y:.56},       // iron lock plate on the seam
    "contact:ground":{x:.50,y:.82},    // chest base on the ground
    "slot:tripod-a":{x:.40,y:.50},     // hoard inventory placement slots
    "slot:tripod-b":{x:.62,y:.50},
    "slot:cups":{x:.50,y:.52},
    "slot:cloth":{x:.35,y:.53},
  },
  // ownership + collision box (AABB in 0..1) for placement / pathing
  ownership:"phaeacian-guest-gifts",
  zones:{ bounds:{ x0:.20,y0:.44,x1:.80,y1:.86 }, footprint:{ x0:.23,y0:.80,x1:.77,y1:.86 } },
  // persistent inventory the hoard represents (survives across states)
  inventory:{ bronze:params.tripods, gold:params.cups, cloth:3 },

  states:{
    initial:"sealed",
    nodes:{
      sealed:   { preview:{ open:0, conceal:0, status:"SEALED",    progress:.25 } },
      open:     { preview:{ open:1, conceal:0, status:"OPEN",      progress:.70 } },
      concealed:{ preview:{ open:0, conceal:1, status:"CONCEALED", progress:.45 } },
    },
    edges:[["sealed","open"],["open","sealed"],["sealed","concealed"],["concealed","sealed"]],
  },
  channels:["open","conceal"],

  preview:()=>({ open:0, conceal:0, status:"SEALED", progress:.25 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
