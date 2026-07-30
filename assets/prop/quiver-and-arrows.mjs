/* prop.quiver-and-arrows — Odysseus's quiver and its counted arrow set.
   PROP asset. One reusable object with a COUNT: a tooled leather quiver
   (base cap, two binding bands, flared mouth ring, baldric strap) holding a
   bundle of fletched arrows, plus the one arrow currently in play staged on
   its flight axis, plus a geometric count register (seven-segment digits and
   a twelve-cell magazine grid) so the depletion is legible without type.

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine's
   dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B21-S01): carry / select / nock / loose / impact /
   retrieve / depleted. The staged arrow rotates and slides about the flight
   pivot per state; the quiver bundle and the register both read the state's
   count, so "one arrow left the quiver" is visible in three places at once.
   Atlas: isolated reusable object; declared scale, grip/support/contact
   anchors, ownership, collision shape, all scene-required states. */
import { makePen, toneSolid, inkLevel, INK, clamp } from "../../engine/halfworld-engine.mjs";

/* ---------------- declared scale + build parameters ----------------
   Source design space is 660x880 px; every number below is in that space
   and is mapped through SX/SY/S so the module recomposes to any canvas. */
const params = {
  capacity:   12,      // arrows the quiver holds when full
  arrowLen:   860,     // real arrow length in mm (declared scale)
  quiverLen: 470,      // quiver body height, design px
  rMouth:     66,      // mouth (top) radius
  rBase:      50,      // base (bottom) radius
  qx:        202,      // quiver axis x
  qy:        782,      // quiver base y
  stageX:    452,      // flight-axis pivot
  stageY:    392,
  shaftLen:  292,      // staged arrow length, design px
  leather:     2,      // ink level: quiver body (light — paper must show)
  band:        4,      // ink level: binding bands / mouth ring
  cane:        2,      // ink level: arrow shafts
  feather:     5,      // ink level: fletching
  bronze:      6,      // ink level: arrowheads / nocks
};

/* per-state performance: staged-arrow transform, quiver tilt, count, extras */
const POSE = {
  carry:    { status:"SLUNG",    progress:0.16, count:12, ang:-1.02, ax:  -6, ay:  -8, tilt: 0.15 },
  select:   { status:"SELECT",   progress:0.30, count:12, ang:-0.58, ax: -22, ay: -14, tilt: 0.11, pick:true },
  nock:     { status:"NOCKED",   progress:0.46, count:12, ang: 0.00, ax:   0, ay:   0, tilt: 0.05, string:true },
  loose:    { status:"LOOSED",   progress:0.62, count:11, ang: 0.00, ax:  30, ay: -16, tilt: 0.05, motion:true },
  impact:   { status:"STRUCK",   progress:0.80, count:11, ang: 0.00, ax:  14, ay:  10, tilt: 0.05, target:true },
  retrieve: { status:"RECOVER",  progress:0.92, count:11, ang: 0.95, ax: -34, ay:  26, tilt: 0.11, path:true },
  depleted: { status:"SPENT",    progress:1.00, count: 0, ang: 0.00, ax:   0, ay:   0, tilt: 0.02, ghost:true },
};

/* ---------------- one arrow, drawn along its own local +x axis ---------- */
function drawArrow(pen, g, L, opt={}){
  const H2 = L/2, th = L*0.031;
  const ghost = !!opt.ghost;
  if (ghost){
    /* the arrow that is no longer there: the same silhouette, drawn as a
       dashed outline heavy enough to survive the dot lattice */
    g.strokeStyle = inkLevel(6); g.lineWidth = Math.max(3, L*0.017);
    g.setLineDash([L*0.045, L*0.032]); g.lineCap="butt"; g.lineJoin="miter";
    g.beginPath(); g.rect(-H2, -th/2, H2*1.80, th); g.stroke();
    g.beginPath();
    g.moveTo(H2*0.80, -th*0.42); g.lineTo(H2*0.83, -th*1.55); g.lineTo(H2*0.94, -th*0.60);
    g.lineTo(H2*1.00, 0);
    g.lineTo(H2*0.94,  th*0.60); g.lineTo(H2*0.83,  th*1.55); g.lineTo(H2*0.80,  th*0.42);
    g.stroke();
    for (const s of [-1,1]){
      g.beginPath();
      g.moveTo(-H2*0.97, s*th*0.42); g.lineTo(-H2*0.90, s*th*2.55);
      g.lineTo(-H2*0.66, s*th*1.35); g.lineTo(-H2*0.62, s*th*0.40);
      g.stroke();
    }
    g.setLineDash([]);
    return;
  }
  // shaft (light cane — the object must not print as a black bar)
  pen.paint(()=>{ g.rect(-H2, -th/2, H2*1.80, th); }, toneSolid(inkLevel(params.cane)), Math.max(2.5,L*0.013));
  // shaft grain: one dark edge, one bright edge (round the cane)
  g.fillStyle = inkLevel(4); g.fillRect(-H2*0.94, th*0.10, H2*1.68, th*0.26);
  // binding collar behind the head
  pen.paint(()=>{ g.rect(H2*0.72, -th*0.80, H2*0.10, th*1.60); }, toneSolid(inkLevel(params.band)), Math.max(2,L*0.010));
  // barbed bronze head
  pen.paint(()=>{
    g.moveTo(H2*0.80, -th*0.42);
    g.lineTo(H2*0.83, -th*1.55);
    g.lineTo(H2*0.94, -th*0.60);
    g.lineTo(H2*1.00,  0);
    g.lineTo(H2*0.94,  th*0.60);
    g.lineTo(H2*0.83,  th*1.55);
    g.lineTo(H2*0.80,  th*0.42);
    g.closePath();
  }, toneSolid(inkLevel(params.bronze)), Math.max(2.5,L*0.012));
  // fletching — two visible vanes + a hint of the third
  const vane = (s)=> pen.paint(()=>{
    g.moveTo(-H2*0.97, s*th*0.42);
    g.lineTo(-H2*0.90, s*th*2.55);
    g.lineTo(-H2*0.66, s*th*1.35);
    g.lineTo(-H2*0.62, s*th*0.40);
    g.closePath();
  }, toneSolid(inkLevel(params.feather)), Math.max(2,L*0.010));
  vane(-1); vane(1);
  g.strokeStyle = INK; g.lineWidth = Math.max(1.6, L*0.007);
  for (let i=0;i<3;i++){ const x=-H2*(0.92-i*0.10);
    g.beginPath(); g.moveTo(x, -th*1.5); g.lineTo(x+L*0.014, -th*0.5); g.stroke();
    g.beginPath(); g.moveTo(x,  th*1.5); g.lineTo(x+L*0.014,  th*0.5); g.stroke(); }
  // nock block with its string notch
  pen.paint(()=>{ g.rect(-H2*1.01, -th*0.85, H2*0.075, th*1.70); }, toneSolid(inkLevel(params.bronze)), Math.max(2,L*0.010));
  g.fillStyle = inkLevel(1);
  g.beginPath(); g.moveTo(-H2*1.01, -th*0.42); g.lineTo(-H2*0.965, 0); g.lineTo(-H2*1.01, th*0.42); g.closePath(); g.fill();
}

/* ---------------- seven-segment numeral, drawn as GEOMETRY -------------- */
const SEG = { // a b c d e f g
  0:[1,1,1,1,1,1,0], 1:[0,1,1,0,0,0,0], 2:[1,1,0,1,1,0,1], 3:[1,1,1,1,0,0,1],
  4:[0,1,1,0,0,1,1], 5:[1,0,1,1,0,1,1], 6:[1,0,1,1,1,1,1], 7:[1,1,1,0,0,0,0],
  8:[1,1,1,1,1,1,1], 9:[1,1,1,1,0,1,1],
};
function drawDigit(pen, g, x, y, w, h, d){
  const t = w*0.26, on = toneSolid(inkLevel(7));
  const m = h/2, s = SEG[d] || SEG[0];
  /* lit segments are solid ink with a contour; unlit segments are a bare
     ghost fill with NO contour — an outlined "off" bar lights every segment
     and the numeral becomes an 8. */
  const bar = (bx,by,bw,bh,lit)=> lit
    ? pen.paint(()=>{ g.rect(bx,by,bw,bh); }, on, 2.6)
    : pen.fillPath(()=>{ g.rect(bx+bw*0.14,by+bh*0.14,bw*0.72,bh*0.72); }, inkLevel(1));
  bar(x+t*0.55, y,             w-t*1.10, t, s[0]);            // a top
  bar(x+w-t,    y+t*0.55,      t, m-t*0.85,  s[1]);           // b upper right
  bar(x+w-t,    y+m+t*0.30,    t, m-t*0.85,  s[2]);           // c lower right
  bar(x+t*0.55, y+h-t,         w-t*1.10, t, s[3]);            // d bottom
  bar(x,        y+m+t*0.30,    t, m-t*0.85,  s[4]);           // e lower left
  bar(x,        y+t*0.55,      t, m-t*0.85,  s[5]);           // f upper left
  bar(x+t*0.55, y+m-t*0.50,    w-t*1.10, t, s[6]);            // g middle
}

/* ---------------- the module draw ---------------- */
function drawQuiver(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "carry";
  const P = POSE[mode] || POSE.carry;
  const SX = W/660, SY = H/880, S = Math.min(SX, SY);
  const X = px => px*SX, Y = py => py*SY;
  const count = clamp(typeof st.count === "number" ? st.count : P.count, 0, params.capacity);

  /* ── ground register under the quiver: broken dashes, never a full bar ── */
  g.strokeStyle = inkLevel(5); g.lineWidth = Math.max(2, S*4); g.lineCap="butt";
  for (let x=96; x<322; x+=34){ g.beginPath(); g.moveTo(X(x), Y(806)); g.lineTo(X(x+22), Y(806)); g.stroke(); }

  /* ── corner brackets instead of a framing rectangle (no striping) ── */
  const br = (cx,cy,dx,dy)=>{ g.strokeStyle=INK; g.lineWidth=Math.max(2,S*4.5);
    g.beginPath(); g.moveTo(X(cx),Y(cy+dy)); g.lineTo(X(cx),Y(cy)); g.lineTo(X(cx+dx),Y(cy)); g.stroke(); };
  br(40, 40,  62,  56); br(620, 40, -62,  56);
  br(40,842,  62, -56); br(620,842, -62, -56);

  /* ================= THE QUIVER ================= */
  g.save();
  g.translate(X(params.qx), Y(params.qy));
  g.scale(S, S);                  // uniform: the quiver never distorts
  g.rotate(P.tilt);

  const L = params.quiverLen, rM = params.rMouth, rB = params.rBase;
  // baldric strap: leaves the mouth, loops left, buckles at the mid-body
  const strapT = 26;
  pen.paint(()=>{
    g.moveTo(-rM*0.86, -L+6);
    g.quadraticCurveTo(-rM*2.60, -L*0.92, -rM*2.05, -L*0.44);
    g.lineTo(-rM*1.42, -L*0.42);
    g.quadraticCurveTo(-rM*1.90, -L*0.86, -rM*0.60, -L+strapT*0.6);
    g.closePath();
  }, toneSolid(inkLevel(3)), 4.5);
  g.strokeStyle=INK; g.lineWidth=2.2;
  for (let i=1;i<=4;i++){ const u=i/5;
    const px=-rM*(2.30-0.55*u), py=-L*(0.92-0.46*u);
    g.beginPath(); g.moveTo(px-10, py); g.lineTo(px+16, py+6); g.stroke(); }
  // buckle plate
  pen.paint(()=>{ g.rect(-rM*1.62, -L*0.50, 34, 26); }, toneSolid(inkLevel(5)), 4);

  // body: light leather, tapered
  pen.paint(()=>{
    g.moveTo(-rB, 0); g.lineTo(-rM, -L); g.lineTo(rM, -L); g.lineTo(rB, 0); g.closePath();
  }, toneSolid(inkLevel(params.leather)), 5);
  // rounding: bright left edge, darker right face
  g.fillStyle = inkLevel(1);
  g.beginPath(); g.moveTo(-rB+9,-6); g.lineTo(-rM+9,-L+8); g.lineTo(-rM+30,-L+8); g.lineTo(-rB+30,-6); g.closePath(); g.fill();
  g.fillStyle = inkLevel(4);
  g.beginPath(); g.moveTo(rB-8,-6); g.lineTo(rM-8,-L+8); g.lineTo(rM-30,-L+8); g.lineTo(rB-30,-6); g.closePath(); g.fill();
  // base cap
  pen.paint(()=>{ g.ellipse(0, 0, rB, rB*0.30, 0, 0, 7); }, toneSolid(inkLevel(4)), 5);
  pen.paint(()=>{ g.rect(-rB-4, -34, (rB+4)*2, 34); }, toneSolid(inkLevel(3)), 4.5);

  // two binding bands (quiver-width only — they cannot stripe the frame)
  for (const [uy, h] of [[0.34, 26],[0.66, 22]]){
    const yy = -L*uy, r = rB + (rM-rB)*uy;
    pen.paint(()=>{ g.rect(-r-5, yy-h/2, (r+5)*2, h); }, toneSolid(inkLevel(params.band)), 4.5);
    g.strokeStyle=INK; g.lineWidth=2;
    for (let x=-r+8; x<r-6; x+=18){ g.beginPath(); g.moveTo(x, yy-h/2+4); g.lineTo(x+7, yy+h/2-4); g.stroke(); }
  }

  // mouth ring + the dark interior
  pen.paint(()=>{ g.ellipse(0, -L, rM+8, (rM+8)*0.34, 0, 0, 7); }, toneSolid(inkLevel(params.band)), 5);
  pen.paint(()=>{ g.ellipse(0, -L, rM-10, (rM-10)*0.30, 0, 0, 7); },
            toneSolid(inkLevel(count?5:6)), 4);

  /* the stowed bundle — how many arrows are actually in there */
  const shown = Math.min(count, 7);
  for (let i=0;i<shown;i++){
    const u = shown>1 ? (i/(shown-1))*2-1 : 0;
    const a = u*0.17;
    const raise = (mode==="select" && i===Math.floor(shown/2)) ? 104 : 0;
    /* stagger hard: aligned nock-ends would fuse into one black band */
    const len = 148 + ((i*7)%4)*32 + raise;
    const bx = u*(rM-20), by = -L - 4;
    g.save(); g.translate(bx, by); g.rotate(a);
    // shaft — wide and light so the contour is a line, not the whole cane
    pen.paint(()=>{ g.rect(-7, -len, 14, len+18); }, toneSolid(inkLevel(params.cane)), 3);
    g.fillStyle = inkLevel(4); g.fillRect(3, -len+8, 3.5, len);
    // nock end
    pen.paint(()=>{ g.rect(-8, -len, 16, 14); }, toneSolid(inkLevel(params.bronze)), 2.6);
    // vanes
    const vane = (s)=> pen.paint(()=>{
      g.moveTo(s*7, -len+16); g.lineTo(s*20, -len+27); g.lineTo(s*12, -len+56); g.lineTo(s*7, -len+50); g.closePath();
    }, toneSolid(inkLevel(4)), 2.6);
    vane(-1); vane(1);
    if (raise){ // the hand that is taking this one
      pen.paint(()=>{ g.rect(-13, -len+96, 26, 30); }, toneSolid(inkLevel(6)), 3.4);
      g.strokeStyle=INK; g.lineWidth=2;
      for (let k=1;k<3;k++){ g.beginPath(); g.moveTo(-13, -len+96+k*10); g.lineTo(13, -len+96+k*10); g.stroke(); }
    }
    g.restore();
  }
  if (!count){ // depleted: an empty mouth reads as a hole with a light floor
    g.fillStyle = inkLevel(3);
    g.beginPath(); g.ellipse(0, -L+16, rM-22, (rM-22)*0.26, 0, 0, 7); g.fill();
  }
  g.restore();

  /* ================= THE STAGED ARROW ================= */
  // flight axis: a broken guide, so the plate reads as an ordnance diagram
  g.strokeStyle = inkLevel(3); g.lineWidth = Math.max(1.6, S*2.6);
  for (let x=316; x<640; x+=30){ g.beginPath(); g.moveTo(X(x), Y(params.stageY)); g.lineTo(X(x+15), Y(params.stageY)); g.stroke(); }

  if (P.target){ // the door-post the arrow buries itself in (vertical, not a bar)
    pen.paint(()=>{ g.rect(X(596), Y(196), X(38), Y(392)); }, toneSolid(inkLevel(3)), Math.max(3,S*5));
    g.strokeStyle = inkLevel(5); g.lineWidth = Math.max(1.6,S*2.4);
    for (let y=214; y<576; y+=26){ g.beginPath(); g.moveTo(X(600), Y(y)); g.lineTo(X(628), Y(y+9)); g.stroke(); }
  }

  const px = params.stageX + P.ax, py = params.stageY + P.ay;
  g.save();
  g.translate(X(px), Y(py));
  g.scale(S, S);                  // uniform: the arrow never distorts
  g.rotate(P.ang);

  if (P.motion){ // speed bars trailing the nock — short strokes only
    g.strokeStyle = inkLevel(4); g.lineCap="round";
    for (let i=0;i<3;i++){ g.lineWidth = 9-i*2;
      g.beginPath(); g.moveTo(-params.shaftLen*0.62-i*26, -18+i*18); g.lineTo(-params.shaftLen*0.62-i*26-46, -18+i*18); g.stroke(); }
  }
  drawArrow(pen, g, params.shaftLen, { ghost: !!P.ghost });
  if (P.string){ // the bowstring taken at the nock
    g.strokeStyle = INK; g.lineWidth = 6; g.lineCap="butt";
    g.beginPath(); g.moveTo(-params.shaftLen*0.50-3, -128); g.lineTo(-params.shaftLen*0.50-3, 128); g.stroke();
    pen.paint(()=>{ g.rect(-params.shaftLen*0.50-11, -22, 16, 44); }, toneSolid(inkLevel(5)), 3.4);
  }
  g.restore();

  if (P.target){ // impact burst at the buried head
    const hx = px + params.shaftLen*0.50, hy = py;
    g.strokeStyle = INK; g.lineWidth = Math.max(2, S*3.4); g.lineCap="round";
    for (let i=0;i<7;i++){ const a = -1.15 + i*0.38;
      g.beginPath(); g.moveTo(X(hx-12)+Math.cos(a)*S*20, Y(hy)+Math.sin(a)*S*20);
      g.lineTo(X(hx-12)+Math.cos(a)*S*46, Y(hy)+Math.sin(a)*S*46); g.stroke(); }
  }
  if (P.path){ // the recovery arc back to the mouth
    g.strokeStyle = inkLevel(5); g.lineWidth = Math.max(2, S*3.2);
    g.setLineDash([S*13, S*11]);
    g.beginPath(); g.moveTo(X(px-40), Y(py-72));
    g.quadraticCurveTo(X(330), Y(180), X(params.qx+40), Y(268)); g.stroke();
    g.setLineDash([]);
    g.fillStyle = INK; g.beginPath();
    g.moveTo(X(params.qx+40), Y(268)); g.lineTo(X(params.qx+66), Y(236)); g.lineTo(X(params.qx+72), Y(276)); g.closePath(); g.fill();
  }

  /* ================= THE COUNT REGISTER ================= */
  const rx = 372, ry = 686, dw = 54, dh = 104;
  drawDigit(pen, g, X(rx),        Y(ry), X(dw), Y(dh), Math.floor(count/10));
  drawDigit(pen, g, X(rx+dw+20),  Y(ry), X(dw), Y(dh), count%10);
  // twelve-cell magazine grid: filled = still in the quiver, hollow = spent
  const gx = rx+dw*2+58, gy = ry-6, cs = 28, gp = 9;
  for (let i=0;i<params.capacity;i++){
    const c = i%3, r = (i-c)/3;
    const cx = gx + c*(cs+gp), cy = gy + r*(cs+gp);
    pen.paint(()=>{ g.rect(X(cx), Y(cy), X(cs), Y(cs)); },
              toneSolid(inkLevel(1)), Math.max(2, S*2.6));      // the slot
    if (i < count)                                              // the arrow in it
      pen.fillPath(()=>{ g.rect(X(cx+cs*0.34), Y(cy+cs*0.16), X(cs*0.32), Y(cs*0.68)); }, inkLevel(7));
  }
}

export const asset = {
  id:"prop.quiver-and-arrows",
  type:"PROP",
  name:"Quiver and Arrows",
  statusWord:"COUNTED",
  scene:"OD-B21-S01",

  params,
  // back -> front draw order the module honors
  layers:["ground","brackets","strap","quiver-body","bands","mouth","bundle",
          "flight-axis","target-post","staged-arrow","string","fx","register"],

  // normalized 0..1 attachment / contact anchors
  anchors:{
    mouth:{x:.31,y:.35},              // where an arrow is drawn from / returned to
    "grip:strap":{x:.19,y:.51},       // baldric shoulder grip
    "grip:shaft":{x:.31,y:.20},       // hand on the selected shaft
    "support:back":{x:.31,y:.62},     // rides on the archer's back
    "contact:ground":{x:.31,y:.90},   // base cap when the quiver is stood down
    nock:{x:.46,y:.45},               // string contact on the staged arrow
    tip:{x:.90,y:.45},                // striking point
    "contact:target":{x:.94,y:.45},   // where the head buries
    register:{x:.66,y:.80},           // the count readout
  },
  // collision shape: the quiver body as an oriented capsule
  collision:{ kind:"capsule", a:{x:.31,y:.35}, b:{x:.31,y:.89}, r:.10 },
  ownership:"odysseus",               // the bow's arrows; kept with the bow

  states:{
    initial:"carry",
    nodes:{
      carry:    { preview:{ mode:"carry",    status:"SLUNG",    progress:0.16 } },
      select:   { preview:{ mode:"select",   status:"SELECT",   progress:0.30 } },
      nock:     { preview:{ mode:"nock",     status:"NOCKED",   progress:0.46 } },
      loose:    { preview:{ mode:"loose",    status:"LOOSED",   progress:0.62 } },
      impact:   { preview:{ mode:"impact",   status:"STRUCK",   progress:0.80 } },
      retrieve: { preview:{ mode:"retrieve", status:"RECOVER",  progress:0.92 } },
      depleted: { preview:{ mode:"depleted", status:"SPENT",    progress:1.00 } },
    },
    edges:[
      ["carry","select"],["select","nock"],["nock","loose"],["loose","impact"],
      ["impact","retrieve"],["retrieve","carry"],["retrieve","select"],
      ["loose","depleted"],["impact","depleted"],["depleted","retrieve"],
      ["select","carry"],["nock","select"],
    ],
  },
  channels:["mode","count","angle","draw","t"],

  /* the count is a channel: a scene may pass state.count to override the
     per-mode default (POSE[mode].count) as the set is spent down. */
  preview:()=>({ mode:"carry", status:"SLUNG", progress:0.16, t:0 }),
  draw(ctx,W,H,state){
    const st = state || {};
    const mode = st.mode || "carry";
    drawQuiver(ctx, W, H, st);
    const count = typeof st.count==="number" ? st.count : (POSE[mode]||POSE.carry).count;
    return { anchors:asset.anchors, collision:asset.collision, count };
  },
};
export default asset;
