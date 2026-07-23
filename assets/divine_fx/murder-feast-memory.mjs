/* divine_fx.murder-feast-memory — Agamemnon's death surfacing in the underworld.
   DIVINE_FX asset. Scene function (OD-B11-S06): the remembered banquet TURNS to
   ambush inside one faint hall tableau. SOURCE (the feast — a laid table, cups,
   guests reclining) -> FIELD (the hall: back wall, floor, a great doorway) ->
   TRANSFORM (over t / `transform` the cups tip, the guest bodies topple one by
   one, Cassandra flings her arms out reaching, and the doors swing shut — the
   trap closing) -> visible CONSEQUENCE (the killing sealed inside the closed hall).
   Everything is a low-tone ghost silhouette so the whole reads as recollection,
   half-present. Solid grays + contour into the offscreen ctx; the engine POST
   pass supplies the halftone — do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, smooth } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const frac = x => x - Math.floor(x);

const params = {
  period:   6.5,     // seconds for feast -> ambush to sweep once
  horizon:  0.72,    // hall floor line (frac of H)
  wallTop:  0.28,    // back wall rises from here
  doorX0:   0.420,   // the great doorway opening (in the back wall) — narrow, centred
  doorX1:   0.580,
  doorTop:  0.395,
  tableW:   0.62,    // banquet table width (frac of W)
  guests:   3,       // reclining guests behind the table
  guestX: [0.285, 0.500, 0.715],
  guestFall:[0.28, 0.48, 0.66],   // per-guest transform threshold to topple
  cups:     5,       // vessels on the board (tip as the deed lands)
};

/* a ghost fill: flat gray body + a thin same-family tonal contour so a shape
   holds an edge but stays faint under the halftone (never full-black INK). */
function ghost(g, pathFn, fillL, edgeL, lw=2){
  edgeL = edgeL ?? (fillL+2);
  g.beginPath(); pathFn();
  g.fillStyle = inkLevel(clamp(fillL,1,7)); g.fill();
  g.strokeStyle = inkLevel(clamp(edgeL,1,7)); g.lineWidth = lw; g.lineJoin="round"; g.stroke();
}

/* ---- a compact silhouette FIGURE from round-capped limbs + a head.
   Local unit = height h; origin at the feet midpoint (ox, gy). dir flips facing.
   Poses: feast (reclining, cup raised) / fall (toppling forward) / reach
   (Cassandra, both arms flung out) / strike (attacker, raised blade). ---- */
function fig(pen, g, ox, gy, h, tone, dir, pose, lw){
  const P = (lx,ly)=>({ x: ox + lx*h*dir, y: gy - ly*h });
  let J;
  if (pose==="feast"){          // reclining at the board, one hand lifting a cup
    J = {
      hip:P(0,.46), sh:P(.02,.80), neck:P(.02,.86), head:P(.04,.965), hr:h*.10,
      hipL:P(-.09,.46), kneeB:P(-.09,.23), footB:P(-.11,0),
      hipR:P(.09,.46), kneeF:P(.09,.23), footF:P(.11,0),
      shA:P(.14,.80), elA:P(.24,.68), wrA:P(.21,.92), cup:true,   // cup lifted
      shB:P(-.12,.80), elB:P(-.20,.66), wrB:P(-.18,.52),
    };
  } else if (pose==="fall"){    // struck — pitching forward over the board
    J = {
      hip:P(.05,.30), sh:P(.26,.32), neck:P(.33,.26), head:P(.45,.17), hr:h*.10,
      hipL:P(.0,.30), kneeB:P(-.11,.18), footB:P(-.26,.05),
      hipR:P(.08,.30), kneeF:P(-.02,.13), footF:P(-.15,.005),
      shA:P(.26,.32), elA:P(.44,.30), wrA:P(.58,.23),
      shB:P(.26,.30), elB:P(.33,.15), wrB:P(.44,.05),
    };
  } else if (pose==="reach"){   // Cassandra — braced, both arms flung up & out
    J = {
      hip:P(0,.44), sh:P(-.04,.78), neck:P(-.05,.85), head:P(-.06,.965), hr:h*.10,
      hipL:P(-.10,.44), kneeB:P(-.16,.20), footB:P(-.24,0),
      hipR:P(.09,.44), kneeF:P(.15,.22), footF:P(.22,0),
      shA:P(.03,.78), elA:P(.22,.98), wrA:P(.42,1.15), openA:true,  // upper reaching hand
      shB:P(-.11,.78), elB:P(-.30,.96), wrB:P(-.46,1.11), openB:true, // far reaching hand
    };
  } else {                      // strike — the murderer, blade raised
    J = {
      hip:P(-.05,.46), sh:P(.12,.80), neck:P(.10,.86), head:P(.09,.965), hr:h*.105,
      hipL:P(-.11,.46), kneeB:P(-.11,.23), footB:P(-.22,0),
      hipR:P(.03,.46), kneeF:P(.16,.22), footF:P(.27,0),
      shA:P(.14,.80), elA:P(.05,.99), wrA:P(.15,1.13), bladeTip:P(.31,1.30),
      shB:P(.10,.80), elB:P(.25,.70), wrB:P(.37,.62),
    };
  }
  const L = lw;
  // back leg + far arm (behind torso for depth)
  pen.limb(()=>{ g.moveTo(J.hipL.x,J.hipL.y); g.lineTo(J.kneeB.x,J.kneeB.y); g.lineTo(J.footB.x,J.footB.y); }, tone, L*0.92);
  pen.limb(()=>{ g.moveTo(J.shB.x,J.shB.y); g.lineTo(J.elB.x,J.elB.y); g.lineTo(J.wrB.x,J.wrB.y); }, tone, L*0.7);
  if (J.openB){ pen.paint(()=>{ g.arc(J.wrB.x,J.wrB.y,L*0.7,0,TAU); }, tone, Math.max(2,L*0.4)); }
  // torso
  pen.limb(()=>{ g.moveTo(J.hip.x,J.hip.y); g.lineTo(J.sh.x,J.sh.y); }, tone, L*1.5);
  // front leg
  pen.limb(()=>{ g.moveTo(J.hipR.x,J.hipR.y); g.lineTo(J.kneeF.x,J.kneeF.y); g.lineTo(J.footF.x,J.footF.y); }, tone, L*0.97);
  // neck + head
  pen.limb(()=>{ g.moveTo(J.sh.x,J.sh.y); g.lineTo(J.neck.x,J.neck.y); }, tone, L*0.7);
  pen.paint(()=>{ g.arc(J.head.x,J.head.y,J.hr,0,TAU); }, tone, 3);
  // near arm
  pen.limb(()=>{ g.moveTo(J.shA.x,J.shA.y); g.lineTo(J.elA.x,J.elA.y); g.lineTo(J.wrA.x,J.wrA.y); }, tone, L*0.76);
  if (J.openA){ pen.paint(()=>{ g.arc(J.wrA.x,J.wrA.y,L*0.75,0,TAU); }, tone, Math.max(2,L*0.4)); }
  // a lifted cup
  if (J.cup){
    pen.paint(()=>{ g.moveTo(J.wrA.x-L*0.9, J.wrA.y-L*0.2); g.lineTo(J.wrA.x+L*0.9, J.wrA.y-L*0.2);
      g.lineTo(J.wrA.x+L*0.5, J.wrA.y-L*1.5); g.lineTo(J.wrA.x-L*0.5, J.wrA.y-L*1.5); g.closePath(); }, tone, Math.max(2,L*0.4));
  }
  // weapon (attacker)
  if (J.bladeTip){
    pen.ink(()=>{ g.moveTo(J.wrA.x,J.wrA.y); g.lineTo(J.bladeTip.x,J.bladeTip.y); }, Math.max(3,L*0.5));
    pen.ink(()=>{ g.moveTo(J.wrA.x-L*0.7*dir, J.wrA.y-L*0.2); g.lineTo(J.wrA.x+L*0.7*dir, J.wrA.y+L*0.2); }, Math.max(2,L*0.4));
  }
}

/* ---- FIELD: the hall of the murder — faint air, back wall, floor, a couple of
   perspective floor lines converging on the doorway. Kept low so it reads as a
   remembered room, not a solid set. ---- */
function drawField(g,W,H){
  const hz = H*params.horizon, wt = H*params.wallTop;
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,wt);            // air above the wall
  g.fillStyle = inkLevel(2); g.fillRect(0,wt,W,hz-wt);        // back wall band
  g.fillStyle = inkLevel(2); g.fillRect(0,hz,W,H-hz);         // floor
  // cornice + horizon rules
  g.strokeStyle = inkLevel(4); g.lineWidth = 2;
  g.beginPath(); g.moveTo(0,wt); g.lineTo(W,wt); g.stroke();
  g.strokeStyle = inkLevel(3); g.lineWidth = 2;
  g.beginPath(); g.moveTo(0,hz); g.lineTo(W,hz); g.stroke();
  // perspective floor lines toward the doorway centre
  g.strokeStyle = inkLevel(3); g.lineWidth = 1.5; g.globalAlpha = 0.6;
  const vx = W*0.5, vy = hz;
  for (const fx of [0.04,0.24,0.76,0.96]){ g.beginPath(); g.moveTo(W*fx,H); g.lineTo(vx,vy); g.stroke(); }
  g.globalAlpha = 1;
}

/* ---- the great DOORWAY in the back wall, its two leaves swinging shut as the
   ambush lands. c: closed fraction 0..1 (0 = flung open, 1 = sealed). ---- */
function drawDoors(pen,g,W,H,c){
  const x0=W*params.doorX0, x1=W*params.doorX1, oTop=H*params.doorTop, oBot=H*params.horizon;
  const openW=x1-x0, halfW=openW/2, oh=oBot-oTop;
  // the lit hall BEYOND, seen through the narrowing gap (light slot between the leaves)
  g.fillStyle=inkLevel(1); g.beginPath(); g.rect(x0, oTop, openW, oh); g.fill();
  // jambs + lintel frame (crisp — the one architectural mark)
  pen.paint(()=>{ g.rect(x0-W*0.024, oTop-H*0.022, openW+W*0.048, H*0.024); }, toneSolid(inkLevel(5)), 3); // lintel
  pen.paint(()=>{ g.rect(x0-W*0.024, oTop, W*0.024, oh); }, toneSolid(inkLevel(5)), 3);                    // left jamb
  pen.paint(()=>{ g.rect(x1, oTop, W*0.024, oh); }, toneSolid(inkLevel(5)), 3);                            // right jamb
  // two heavy leaves swinging shut over the light slot: face grows open(thin)->shut(full half)
  const fw = halfW*(0.06 + 0.94*c);
  const leaf = (hx, dir)=>{               // hx = hinge x, dir = +1 sweeps right, -1 left
    const fx0 = dir>0 ? hx : hx-fw, fx1 = dir>0 ? hx+fw : hx;
    pen.paint(()=>{ g.rect(fx0, oTop, fw, oh); }, toneSolid(inkLevel(5)), 3);
    // horizontal plank battens
    g.strokeStyle=inkLevel(2); g.lineWidth=1.4;
    for (let k=1;k<4;k++){ const y=oTop+oh*k/4; g.beginPath(); g.moveTo(fx0+W*0.004,y); g.lineTo(fx1-W*0.004,y); g.stroke(); }
    // a ring handle near the free (meeting) edge
    const hxr = dir>0 ? fx1-W*0.012 : fx0+W*0.012;
    g.strokeStyle=inkLevel(2); g.lineWidth=2; g.beginPath(); g.arc(hxr, oTop+oh*0.52, W*0.009, 0, TAU); g.stroke();
  };
  leaf(x0, +1);   // left leaf, hinged left
  leaf(x1, -1);   // right leaf, hinged right
  // the meeting seam when nearly shut — the trap sealed
  if (c>0.80){ pen.ink(()=>{ g.moveTo(W*0.5,oTop); g.lineTo(W*0.5,oBot); }, 2.5); }
}

/* ---- the banquet TABLE: a laid board with a hanging cloth and vessels that
   tip over as the deed lands (the first tipped cup is the SOURCE mark). ---- */
function drawTable(pen,g,W,H,tf){
  const hz=H*params.horizon, cx=W*0.5, tw=W*params.tableW;
  const topY = hz - H*0.135, th = H*0.045;
  // vessels on the board (drawn first so the slab edge overlaps their feet)
  for (let i=0;i<params.cups;i++){
    const x = lerp(cx-tw*0.40, cx+tw*0.40, i/(params.cups-1));
    const tipped = tf > (0.18 + i*0.13);
    const cy = topY - H*0.006;
    if (!tipped){
      pen.paint(()=>{ g.moveTo(x-W*0.012,cy); g.lineTo(x+W*0.012,cy);
        g.lineTo(x+W*0.007,cy-H*0.028); g.lineTo(x-W*0.007,cy-H*0.028); g.closePath(); }, toneSolid(inkLevel(5)), 2);
      pen.paint(()=>{ g.rect(x-W*0.014, cy, W*0.028, H*0.006); }, toneSolid(inkLevel(5)), 2); // foot
    } else {                       // knocked over — lying on its side, a spill
      pen.paint(()=>{ g.moveTo(x,cy); g.lineTo(x+W*0.030,cy-H*0.010);
        g.lineTo(x+W*0.030,cy-H*0.024); g.lineTo(x,cy-H*0.014); g.closePath(); }, toneSolid(inkLevel(5)), 2);
      pen.paint(()=>{ g.ellipse(x+W*0.030, cy, W*0.020, H*0.006, 0, 0, TAU); }, toneSolid(inkLevel(4)), 1.5); // spill
    }
  }
  // table slab + hanging cloth
  pen.paint(()=>{ g.rect(cx-tw/2, topY, tw, th); }, toneSolid(inkLevel(4)), 4);
  pen.paint(()=>{ g.rect(cx-tw/2, topY+th, tw, H*0.115); }, toneSolid(inkLevel(3)), 3);
  // a few cloth folds
  g.strokeStyle=inkLevel(4); g.lineWidth=1.5;
  for (let i=1;i<7;i++){ const x=cx-tw/2+tw*i/7; g.beginPath(); g.moveTo(x,topY+th); g.lineTo(x,topY+th+H*0.11); g.stroke(); }
}

/* ---- a body SLUMPED over the board: a torso lump lying on the tabletop, the
   head lolling to one side, an arm sprawled toward the front edge. Sits in the
   table band so it never rises into the doorway — the fallen feast-guests. ---- */
function drawSlump(pen,g, cx, boardTopY, w, lvl, dir){
  const tone = toneSolid(inkLevel(lvl));
  const by = boardTopY - w*0.16;
  // sprawled arm across the board
  pen.limb(()=>{ g.moveTo(cx-dir*w*0.15, by+w*0.02); g.lineTo(cx-dir*w*0.52, boardTopY+w*0.10); }, tone, w*0.11);
  // torso lump lying along the board
  pen.paint(()=>{ g.ellipse(cx, by, w*0.52, w*0.27, 0, 0, TAU); }, tone, 3);
  // head lolling off the far shoulder
  pen.paint(()=>{ g.arc(cx+dir*w*0.55, by-w*0.05, w*0.19, 0, TAU); }, tone, 3);
  // a dangling hand at the sprawled-arm end
  pen.paint(()=>{ g.arc(cx-dir*w*0.52, boardTopY+w*0.10, w*0.09, 0, TAU); }, tone, 2);
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t || 0;
  // transform 0 (feast) .. 1 (ambush): explicit, else sweep over t
  const tf = (typeof st.transform==="number") ? clamp(st.transform,0,1) : smooth(frac(t/params.period));
  const close = smooth(clamp((tf-0.08)/0.82, 0, 1));

  const layers = st.layers || ["field","doors","attacker","guests","table","cassandra"];
  const has = l => layers.includes(l);

  if (has("field")) drawField(g,W,H);
  if (has("doors")) drawDoors(pen,g,W,H,close);

  const boardTopY = H*params.horizon - H*0.135;

  // one feast-guest at the LEFT, over the light wall clear of the doorway: he
  // reclines with a lifted cup, then topples as the deed reaches him.
  if (has("guests")){
    const gy=H*params.horizon, h=H*0.255;
    const fallen = tf > 0.55;
    fig(pen,g, W*0.275, gy, h, toneSolid(inkLevel(fallen?5:4)), 1, fallen?"fall":"feast", h*0.058);
  }

  // the ATTACKER at the RIGHT, over the light wall, blade raised (rises with tf)
  if (has("attacker") && tf>0.12){
    const gy=H*params.horizon, h=H*0.255, lvl=clamp(4+Math.round(tf*2),4,6);
    fig(pen,g, W*0.735, gy, h, toneSolid(inkLevel(lvl)), -1, "strike", h*0.06);
  }

  if (has("table")) drawTable(pen,g,W,H,tf);

  // BODIES draped over the board — appear one by one as the ambush lands. Kept in
  // the table band so they read as the slain feast, not stacked on the doorway.
  if (has("guests")){
    const bw = H*0.092;
    if (tf>0.24) drawSlump(pen,g, W*0.355, boardTopY, bw, clamp(5+Math.round(tf),5,6), -1);
    if (tf>0.42) drawSlump(pen,g, W*0.615, boardTopY, bw, clamp(5+Math.round(tf),5,6),  1);
  }

  // Cassandra in the foreground, flinging her arms up toward the doors closing on her
  if (has("cassandra")){
    const gy=H*0.94, h=H*0.225;
    const lvl = clamp(4+Math.round(tf*2),4,6);
    const rock = Math.sin(t*3.0)*h*0.01*tf;
    fig(pen,g, W*0.42, gy+rock, h, toneSolid(inkLevel(lvl)), 1, "reach", h*0.056);
  }

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.murder-feast-memory",
  type:"DIVINE_FX",
  name:"Murder feast memory",
  statusWord:"REMEMBERED",
  scene:"OD-B11-S06",

  params,
  // back -> front; scene state may pass a subset to isolate a beat
  layers:["field","doors","attacker","guests","table","cassandra"],
  // normalized 0..1 anchors: the hall, the doorway leaves, each body, Cassandra
  anchors:{
    "source:feast-board":{x:.50,y:.62},
    "door:left":{x:.42,y:.53},
    "door:right":{x:.58,y:.53},
    "guest:a":{x:.285,y:.60},
    "guest:b":{x:.500,y:.60},
    "guest:c":{x:.715,y:.60},
    "actor:killer":{x:.83,y:.60},
    "actor:cassandra":{x:.265,y:.80},
    "threshold:doorway":{x:.50,y:.53},
    "camera:wide":{x:.50,y:.50},
  },
  // affected regions for scene placement / occlusion
  zones:{
    board:{ x0:.19,y0:.54,x1:.81,y1:.72 },
    doorway:{ x0:.355,y0:.335,x1:.645,y1:.72 },
    foreground:{ x0:.10,y0:.72,x1:.55,y1:.98 },
  },

  // DIVINE_FX state machine: the feast SOURCE transforming into the sealed ambush
  states:{
    initial:"tableau",
    nodes:{
      // the whole vignette held mid-turn (neutral): cups tipping, first body down
      tableau:{ preview:{ transform:0.45, status:"REMEMBERED", progress:.5 } },
      // the feast intact — guests reclining, cups full, doors flung open (source)
      feast:{ preview:{ transform:0.03, status:"FEASTING", progress:.12,
        layers:["field","doors","guests","table"] } },
      // the turn — cups spill, bodies begin to fall, the doors start to swing
      turning:{ preview:{ transform:0.5, status:"TURNING", progress:.5 } },
      // the ambush sealed — all fallen, Cassandra reaching, the doors shut (transform)
      ambush:{ preview:{ transform:0.95, status:"AMBUSHED", progress:.94 } },
    },
    edges:[["feast","turning"],["turning","ambush"],["ambush","tableau"],
           ["tableau","feast"],["tableau","ambush"]],
  },
  duration:6.5,
  channels:["t","transform","close","glow","reveal"],

  preview:()=>({ transform:0.55, status:"REMEMBERED", progress:.55,
    layers:["field","doors","attacker","guests","table","cassandra"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
