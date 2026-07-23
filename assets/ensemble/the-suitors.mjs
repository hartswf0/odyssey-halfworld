/* ensemble.the-suitors — the swaggering young nobles of Ithaca's great hall:
   gambling, eating, drinking, sprawled on benches, ignoring the stranger at
   the door. ENSEMBLE asset. Built as a REPEATABLE GROUP from a single
   separable member template drawn N times deterministically. Exposes
   formation (rows), density (count), attention (how many face the stranger),
   a reaction-wave (heads turn in sequence across the hall), and fg/bg depth.
   Solid grays + hard contour only — the engine dotify pass supplies halftone.
   Atlas: OD-B01-S03 — swaggering young nobles gambling, eating, drinking,
   ignoring the stranger. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  rows:2,               // formation depth: background + foreground benches
  perRow:[4,3],         // members per row (bg -> fg); density control
  density:1.0,          // 0..1 scales how many of perRow actually draw
  attention:0.0,        // 0 = all absorbed in vice, 1 = all heads to the door
  wave:0.0,             // reaction-wave front position 0..1 across the hall
  seed:1701,            // deterministic variant selection
  strangerSide:-1,      // the stranger stands at the LEFT threshold
  floorLevel:0.60,      // horizon fraction of H
};

/* one member of the ensemble — a lounging young noble on a bench.
   variant: 0 raise-cup · 1 throw-dice · 2 gnaw-meat · 3 sprawl-gesture
   face: -1 looks left(door) .. +1 looks right; small casual angle by default. */
function drawSuitor(pen, g, x, by, s, variant, face){
  const shoulderY = by - 150*s;
  const hipY      = by - 44*s;
  const shw = 96*s, hipw = 66*s;
  const headR = 30*s;
  const headCy = shoulderY - headR*1.05;
  const dark  = toneSolid(inkLevel(6));
  const bench = toneSolid(inkLevel(5));
  const tunic = toneSolid(inkLevel(4));
  const lap   = toneSolid(inkLevel(5));
  const skin  = toneSolid(inkLevel(2));
  const cup   = toneSolid(inkLevel(6));

  // bench / couch the noble sprawls on
  pen.paint(()=>{ g.rect(x-78*s, by-4*s, 156*s, 34*s); }, bench, 5);
  pen.paint(()=>{ g.rect(x-78*s, by+26*s, 20*s, 26*s); }, dark, 4);   // bench legs
  pen.paint(()=>{ g.rect(x+58*s, by+26*s, 20*s, 26*s); }, dark, 4);

  // seated thighs / lap
  pen.paint(()=>{ g.rect(x-hipw*0.95, hipY-2*s, hipw*1.9, 50*s); }, lap, 5);

  // FAR arm behind torso (variant-driven gesture), drawn first for depth
  const farHandY = variant===0 ? shoulderY-58*s : hipY-2*s;
  const farHandX = x - shw*0.44 - (variant===3? 40*s : 10*s);
  pen.limb(()=>{ g.moveTo(x-shw*0.40, shoulderY+8*s); g.lineTo(farHandX, farHandY); }, tunic, 20*s);
  pen.paint(()=>{ g.arc(farHandX, farHandY, 8*s, 0, 7); }, skin, 3.5);

  // torso — tunic trapezoid
  pen.paint(()=>{
    g.moveTo(x-shw/2, shoulderY);
    g.lineTo(x+shw/2, shoulderY);
    g.lineTo(x+hipw/2, hipY);
    g.lineTo(x-hipw/2, hipY);
    g.closePath();
  }, tunic, 5);
  // sash / belt seam
  pen.seam(()=>{ g.moveTo(x-hipw/2, hipY-3*s); g.lineTo(x+hipw/2, hipY-3*s); }, 3);
  // a cross-body sash line for the swagger
  pen.seam(()=>{ g.moveTo(x-shw*0.42, shoulderY+6*s); g.lineTo(x+hipw*0.42, hipY-6*s); }, 3);

  // neck + head
  pen.limb(()=>{ g.moveTo(x, shoulderY); g.lineTo(x, headCy+headR*0.7); }, skin, 16*s);
  // hair (dark cap, back layer)
  pen.paint(()=>{ g.ellipse(x, headCy-headR*0.18, headR*1.02, headR*0.95, 0, 0, 7); }, dark, 4);
  // head skin
  pen.paint(()=>{ g.ellipse(x, headCy, headR*0.9, headR, 0, 0, 7); }, skin, 4);
  // hair front sweep
  pen.paint(()=>{
    g.moveTo(x-headR*0.9, headCy-headR*0.05);
    g.quadraticCurveTo(x, headCy-headR*1.35, x+headR*0.9, headCy-headR*0.05);
    g.quadraticCurveTo(x+headR*0.5, headCy-headR*0.55, x, headCy-headR*0.5);
    g.quadraticCurveTo(x-headR*0.5, headCy-headR*0.55, x-headR*0.9, headCy-headR*0.05);
  }, dark, 3.5);

  // face — direction shows who they attend to.  face<0 -> door (left).
  const fd = clamp(face, -1, 1);
  const eyeY = headCy + headR*0.02;
  g.fillStyle = INK;
  g.beginPath(); g.ellipse(x + fd*headR*0.34, eyeY, headR*0.10, headR*0.13, 0, 0, 7); g.fill();
  if (Math.abs(fd) < 0.6){ // second eye visible when near-frontal
    g.beginPath(); g.ellipse(x - headR*0.24 + fd*headR*0.34, eyeY, headR*0.09, headR*0.12, 0, 0, 7); g.fill();
  }
  // nose wedge toward facing dir
  g.strokeStyle = INK; g.lineWidth = Math.max(2, headR*0.10); g.lineCap="round";
  g.beginPath(); g.moveTo(x + fd*headR*0.30, eyeY+headR*0.06); g.lineTo(x + fd*headR*0.55, eyeY+headR*0.30); g.stroke();
  // mouth — open/braying for the carousers
  g.beginPath(); g.lineWidth=Math.max(2, headR*0.10);
  g.moveTo(x + fd*headR*0.10 - headR*0.18, headCy+headR*0.52);
  g.quadraticCurveTo(x + fd*headR*0.10, headCy+headR*0.70, x + fd*headR*0.10 + headR*0.18, headCy+headR*0.52);
  g.stroke();

  // NEAR arm + prop by variant
  if (variant===0){                 // raise a cup high
    const wx = x + shw*0.5 + 14*s, wy = shoulderY - 46*s;
    pen.limb(()=>{ g.moveTo(x+shw*0.40, shoulderY+8*s); g.lineTo(wx, wy); }, tunic, 22*s);
    pen.paint(()=>{ g.moveTo(wx-13*s, wy-16*s); g.lineTo(wx+13*s, wy-16*s); g.lineTo(wx+8*s, wy+4*s); g.lineTo(wx-8*s, wy+4*s); g.closePath(); }, cup, 4); // goblet bowl
    pen.paint(()=>{ g.rect(wx-4*s, wy+4*s, 8*s, 12*s); }, cup, 3.5);   // stem
    pen.paint(()=>{ g.ellipse(wx, wy+18*s, 12*s, 4*s, 0, 0, 7); }, cup, 3.5); // foot
  } else if (variant===1){          // fling dice down at the board
    const wx = x + shw*0.34, wy = hipY + 30*s;
    pen.limb(()=>{ g.moveTo(x+shw*0.40, shoulderY+10*s); g.lineTo(wx, wy); }, tunic, 22*s);
    pen.paint(()=>{ g.arc(wx, wy, 9*s, 0, 7); }, skin, 3.5);           // hand
  } else if (variant===2){          // gnaw a joint of meat
    const wx = x + shw*0.30, wy = headCy + headR*0.55;
    pen.limb(()=>{ g.moveTo(x+shw*0.38, shoulderY+10*s); g.lineTo(wx, wy); }, tunic, 22*s);
    pen.paint(()=>{ g.ellipse(wx+8*s, wy, 12*s, 8*s, 0.5, 0, 7); }, toneSolid(inkLevel(3)), 3.5); // meat
    pen.ink(()=>{ g.moveTo(wx+18*s, wy-3*s); g.lineTo(wx+24*s, wy-6*s); }, 3); // bone
  } else {                          // sprawl, one arm flung along the bench-back
    const wx = x + shw*0.5 + 40*s, wy = shoulderY + 6*s;
    pen.limb(()=>{ g.moveTo(x+shw*0.40, shoulderY+8*s); g.lineTo(wx, wy); }, tunic, 22*s);
    pen.paint(()=>{ g.arc(wx, wy, 8*s, 0, 7); }, skin, 3.5);
  }
}

/* the low gaming/feasting table in front of a row: dice-board + cups + dishes */
function drawTable(pen, g, y, x0, x1, s){
  const dark=toneSolid(inkLevel(6)), mid=toneSolid(inkLevel(5)), light=toneSolid(inkLevel(3));
  const h = 26*s;
  pen.paint(()=>{ g.rect(x0, y, x1-x0, h); }, mid, 5);            // table top
  pen.paint(()=>{ g.rect(x0+8*s, y+h, 12*s, 34*s); }, dark, 4);  // legs
  pen.paint(()=>{ g.rect(x1-20*s, y+h, 12*s, 34*s); }, dark, 4);
  // scattered cups + a dish + dice board across the top
  const span = x1-x0, n = Math.max(3, Math.round(span/(70*s)));
  for(let i=0;i<n;i++){
    const cx = x0 + span*((i+0.5)/n);
    if (i%3===0){ // goblet
      pen.paint(()=>{ g.moveTo(cx-8*s,y-14*s); g.lineTo(cx+8*s,y-14*s); g.lineTo(cx+5*s,y); g.lineTo(cx-5*s,y); g.closePath(); }, dark, 3.5);
    } else if (i%3===1){ // dish of food
      pen.paint(()=>{ g.ellipse(cx, y-2*s, 16*s, 6*s, 0, 0, 7); }, light, 3.5);
      pen.paint(()=>{ g.arc(cx-5*s, y-6*s, 4*s, 0, 7); }, mid, 2.5);
      pen.paint(()=>{ g.arc(cx+5*s, y-6*s, 4*s, 0, 7); }, mid, 2.5);
    } else { // dice board with pips
      pen.paint(()=>{ g.rect(cx-14*s, y-10*s, 28*s, 10*s); }, light, 3.5);
      g.fillStyle=INK;
      for(let d=0; d<5; d++){ g.beginPath(); g.arc(cx-10*s+d*5*s, y-5*s, 1.6*s, 0, 7); g.fill(); }
    }
  }
}

/* the ignored stranger at the threshold — a lone cloaked silhouette framed in
   the doorway, NOT a full baked character: just enough to read "he stands at
   the door and no one turns his way." Kept clear of the carousing benches. */
function drawStrangerThreshold(pen, g, W, H, horizon){
  const dx = W*0.03, dw = W*0.15, top = horizon - H*0.30;
  // doorway — dark opening (night outside) with a lit lintel
  pen.paint(()=>{ g.rect(dx, top, dw, horizon-top); }, toneSolid(inkLevel(3)), 5);
  pen.paint(()=>{ g.rect(dx-3, top-8, dw+6, 14); }, toneSolid(inkLevel(5)), 4); // lintel
  pen.paint(()=>{ g.rect(dx-3, top-8, 12, horizon-top+8); }, toneSolid(inkLevel(5)), 4); // left jamb
  pen.paint(()=>{ g.rect(dx+dw-9, top-8, 12, horizon-top+8); }, toneSolid(inkLevel(5)), 4); // right jamb
  // stooped cloaked stranger, centered in the opening
  const sx = dx + dw*0.5, base = horizon - H*0.005, s=0.9;
  pen.paint(()=>{                                   // cloak / body
    g.moveTo(sx-22*s, base);
    g.quadraticCurveTo(sx-26*s, base-118*s, sx-6*s, base-150*s);
    g.quadraticCurveTo(sx+24*s, base-120*s, sx+20*s, base);
    g.closePath();
  }, toneSolid(inkLevel(7)), 4);
  pen.paint(()=>{ g.arc(sx-3*s, base-158*s, 17*s, 0, 7); }, toneSolid(inkLevel(7)), 4); // hooded head
  pen.ink(()=>{ g.moveTo(sx+18*s, base); g.lineTo(sx+22*s, base-148*s); }, 3);          // staff
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*(st.floorLevel ?? params.floorLevel);
  const layers = st.layers || ["backwall","floor","stranger","bgrow","bgtable","fgrow","fgtable"];
  const has = l => layers.includes(l);

  const attention = clamp(st.attention ?? params.attention, 0, 1);
  const wave      = clamp(st.wave ?? params.wave, 0, 1);
  const density   = clamp(st.density ?? params.density, 0, 1);
  const seedFn    = (()=>{ let s=(st.seed ?? params.seed)>>>0 || 1; return ()=>{ s^=s<<13; s^=s>>>17; s^=s<<5; return ((s>>>0)%1000)/1000; }; })();
  const perRow    = st.perRow || params.perRow;

  // ---- BACK WALL (light) + hanging shields band ----
  if (has("backwall")){
    g.fillStyle = inkLevel(2); g.fillRect(0,0,W,horizon);
    pen.paint(()=>{ g.rect(0, horizon-H*0.12, W, H*0.12); }, toneSolid(inkLevel(3)), 0); // dado band
    pen.ink(()=>{ g.moveTo(0,horizon-H*0.12); g.lineTo(W,horizon-H*0.12); }, 3);
    // shields / trophies hung on the wall
    for(let i=0;i<5;i++){ const hx=W*(0.20+i*0.15), hy=horizon-H*0.30;
      pen.paint(()=>{ g.ellipse(hx,hy,W*0.028,H*0.028,0,0,7); }, toneSolid(inkLevel(4)), 4);
      pen.ink(()=>{ g.moveTo(hx-W*0.028,hy); g.lineTo(hx+W*0.028,hy); }, 2);
    }
  }

  // ---- FLOOR (lightest, so it reads as ground) ----
  if (has("floor")){
    g.fillStyle = inkLevel(1); g.fillRect(0,horizon,W,H-horizon);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.35;
    for(let j=1;j<=3;j++){ const y=horizon+(H-horizon)*(j/3.2); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- the ignored STRANGER at the left threshold ----
  if (has("stranger")) drawStrangerThreshold(pen, g, W, H, horizon);

  // a running attention/wave that turns heads across the hall.
  // Members are indexed left->right, back->front; the wave sweeps from the
  // stranger's side. faceOf() blends casual angle -> full turn to the door.
  let idx = 0, total = 0;
  const rowCounts = [];
  for(let r=0;r<params.rows;r++){ const c = Math.max(1, Math.round(perRow[r]*density)); rowCounts.push(c); total += c; }
  const faceOf = (i)=>{
    const norm = total>1 ? i/(total-1) : 0;              // 0 nearest door .. 1 far
    const waveTurn = clamp((wave - norm)*4, 0, 1);        // wave front passing i
    const turn = Math.max(attention, waveTurn);
    const casual = (i%2? 0.5 : -0.35);                    // rowdy cross-glances
    return lerp(casual, params.strangerSide, turn);      // -1 toward door when turned
  };

  // ---- BACKGROUND ROW (smaller, higher, drawn first) ----
  if (has("bgrow")){
    const c = rowCounts[1] ?? 0, s = 0.60, by = horizon - H*0.02;
    for(let i=0;i<c;i++){
      const x = lerp(W*0.30, W*0.86, c>1? i/(c-1):0.5) + (seedFn()-0.5)*W*0.02;
      const variant = Math.floor(seedFn()*4);
      drawSuitor(pen, g, x, by, s, variant, faceOf(idx++));
    }
  }
  if (has("bgtable")) drawTable(pen, g, horizon+H*0.005, W*0.24, W*0.90, 0.6);

  // ---- FOREGROUND ROW (larger, lower, in front) ----
  if (has("fgrow")){
    const c = rowCounts[0] ?? 0, s = 1.0, by = H*0.86;
    for(let i=0;i<c;i++){
      const x = lerp(W*0.22, W*0.80, c>1? i/(c-1):0.5) + (seedFn()-0.5)*W*0.03;
      const variant = Math.floor(seedFn()*4);
      drawSuitor(pen, g, x, by, s, variant, faceOf(idx++));
    }
  }
  if (has("fgtable")) drawTable(pen, g, H*0.86+H*0.01, W*0.12, W*0.88, 1.0);
}

export const asset = {
  id:"ensemble.the-suitors",
  type:"ENSEMBLE",
  name:"The suitors",
  statusWord:"CAROUSING",
  scene:"OD-B01-S03",

  params,
  // back -> front; scene state can pass a subset for reveal/occlusion
  layers:["backwall","floor","stranger","bgrow","bgtable","fgrow","fgtable"],
  // normalized 0..1 anchors: member seats, table centers, the ignored door
  anchors:{
    "seat:bg-1":{x:.16,y:.58}, "seat:bg-2":{x:.39,y:.58}, "seat:bg-3":{x:.62,y:.58}, "seat:bg-4":{x:.86,y:.58},
    "seat:fg-1":{x:.22,y:.86}, "seat:fg-2":{x:.51,y:.86}, "seat:fg-3":{x:.80,y:.86},
    "table:bg":{x:.50,y:.63}, "table:fg":{x:.50,y:.90},
    "focus:stranger":{x:.10,y:.55}, "threshold:door":{x:.10,y:.72},
    "camera:hall":{x:.50,y:.55}, "camera:table":{x:.50,y:.80},
  },
  // where the group can be milling / the tables occupy
  zones:{ carouse:{ x0:.12,y0:.52,x1:.90,y1:.94 }, doorway:{ x0:.02,y0:.30,x1:.16,y1:.74 } },

  states:{
    initial:"carousing",
    nodes:{
      // absorbed in vice, nobody looks at the door
      carousing:{ preview:{ attention:0.0, wave:0.0 } },
      // the reaction-wave: heads turn one after another toward the stranger
      turning:{   preview:{ attention:0.0, wave:0.55 } },
      // all attention snapped to the door
      hushed:{    preview:{ attention:1.0, wave:1.0 } },
      // thinner crowd (density) for a wide/early framing
      sparse:{    preview:{ attention:0.0, wave:0.0, density:0.6 } },
    },
    edges:[["carousing","turning"],["turning","hushed"],["hushed","carousing"],["carousing","sparse"]],
  },
  // animation channels the runtime can drive over the scene clock
  channels:["attention","wave","density","formation","camera"],

  preview:()=>({ attention:0.0, wave:0.0, density:1.0, status:"CAROUSING", progress:.2 }),
  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
