/* ensemble.assembly-of-gods — the listening immortals of Olympos.
   ENSEMBLE asset. Scene function (OD-B01-S01): a seated council of gods whose
   COLLECTIVE ATTENTION sweeps from Zeus (left) to Athena (right) as she rises
   to speak. Built as a repeatable group from ONE separable member template
   (drawGod) instanced N times deterministically. Exposes formation, density,
   attention (0=at Zeus .. 1=at Athena), reaction-wave (the ripple/lag of the
   turn across the row), and foreground/background depth controls. Drawn in
   SOLID grays + hard contour; the engine dotify pass supplies the halftone.
   Do NOT bake the speakers in — Zeus/Athena are external focus anchors; only
   two small foreground FOCUS PLINTHS mark the poles the heads turn between. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "/engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

const params = {
  formation:"arc",      // arc | rows | cluster
  rows:2,               // depth tiers (back..front)
  perRow:[7,5],         // members per tier (density)
  attention:0.35,       // 0 = all rapt on ZEUS (left) .. 1 = all on ATHENA (right)
  wave:0.8,             // reaction-wave: how much the turn LAGS across the row
  showFocus:true,       // draw the two foreground focus plinths (Zeus / Athena)
  showGaze:true,        // draw the faint converging attention lines
  seatY:0.66,           // front-row baseline as fraction of H
};

/* -------- ONE member template: a seated, robed immortal --------
   All geometry keyed off `s` (member height). headTurn in -1..1 aims the
   face/gaze toward the current focus; `feat` carries deterministic identity
   (beard, hair, slight scale) so the crowd reads as individuals. */
function drawGod(pen, cx, baseY, s, shade, headTurn, feat){
  const g = pen.ctx;
  const robe = toneSolid(inkLevel(shade.robe));
  const skin = toneSolid(inkLevel(shade.skin));
  const dark = toneSolid(inkLevel(shade.hair));
  const seatT= toneSolid(inkLevel(shade.seat));

  const bodyH  = s*0.50;
  const shoTop = s*0.30;              // shoulder half-width
  const hipBot = s*0.42;              // base half-width
  const shoulderY = baseY - bodyH;
  const headR  = s*0.175*feat.headS;
  const headCy = shoulderY - headR*0.95;

  // low seat-back behind the shoulders (a bench, not a wall — stays light)
  pen.paint(()=>{ g.rect(cx-shoTop*1.15, shoulderY - headR*0.5, shoTop*2.3, s*0.34); },
            seatT, Math.max(2, s*0.022));

  // robe: trapezoid torso, shoulders -> base
  pen.paint(()=>{
    g.moveTo(cx-shoTop, shoulderY);
    g.lineTo(cx+shoTop, shoulderY);
    g.lineTo(cx+hipBot, baseY);
    g.lineTo(cx-hipBot, baseY);
    g.closePath();
  }, robe, Math.max(3, s*0.035));
  // drapery seams
  pen.seam(()=>{ g.moveTo(cx, shoulderY+s*0.02); g.lineTo(cx-headTurn*s*0.06, baseY); }, Math.max(2,s*0.02));
  pen.seam(()=>{ g.moveTo(cx-shoTop*0.5, shoulderY+s*0.06); g.lineTo(cx-hipBot*0.55, baseY); }, Math.max(2,s*0.016));
  pen.seam(()=>{ g.moveTo(cx+shoTop*0.5, shoulderY+s*0.06); g.lineTo(cx+hipBot*0.55, baseY); }, Math.max(2,s*0.016));

  // neck
  pen.paint(()=>{ g.rect(cx-headR*0.34, shoulderY-headR*0.5, headR*0.68, headR*0.8); }, skin, Math.max(2,s*0.02));

  // hair BACK layer (mass framing the skull)
  if (feat.hair!=="bald")
    pen.paint(()=>{ g.ellipse(cx, headCy+headR*0.15, headR*1.12, headR*1.22, 0,0,7); }, dark, Math.max(3,s*0.03));

  // head — turned toward focus: shift the circle slightly in the turn dir
  const hx = cx + headTurn*headR*0.28;
  pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.92, headR, 0,0,7); }, skin, Math.max(3,s*0.032));

  // face: eyes + brow + nose all offset by headTurn (the ATTENTION cue)
  const eyeY = headCy - headR*0.05;
  const gx   = headTurn*headR*0.30;                 // gaze/nose shift
  g.fillStyle = INK;
  const eyeR = headR*0.10;
  const eL = hx - headR*0.34 + gx, eR = hx + headR*0.34 + gx;
  // in strong profile only the leading eye reads
  if (headTurn > -0.55){ g.beginPath(); g.ellipse(eR, eyeY, eyeR, eyeR*1.1, 0,0,7); g.fill(); }
  if (headTurn <  0.55){ g.beginPath(); g.ellipse(eL, eyeY, eyeR, eyeR*1.1, 0,0,7); g.fill(); }
  // brow
  g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.16); g.lineCap="round";
  g.beginPath(); g.moveTo(hx-headR*0.5+gx, eyeY-headR*0.34); g.lineTo(hx+headR*0.5+gx, eyeY-headR*0.34); g.stroke();
  // nose (points the way the head faces)
  g.lineWidth=Math.max(2,headR*0.12);
  g.beginPath(); g.moveTo(hx+gx*0.6, eyeY+headR*0.06);
  g.lineTo(hx + headTurn*headR*0.42, eyeY+headR*0.42); g.stroke();

  // hair FRONT cap + optional beard
  if (feat.hair!=="bald")
    pen.paint(()=>{
      g.moveTo(hx-headR*0.95, headCy-headR*0.05);
      g.quadraticCurveTo(hx, headCy-headR*1.35, hx+headR*0.95, headCy-headR*0.05);
      g.quadraticCurveTo(hx+headR*0.5, headCy-headR*0.5, hx, headCy-headR*0.45);
      g.quadraticCurveTo(hx-headR*0.5, headCy-headR*0.5, hx-headR*0.95, headCy-headR*0.05);
    }, dark, Math.max(2,s*0.025));
  if (feat.beard)
    pen.paint(()=>{
      g.moveTo(hx-headR*0.6, headCy+headR*0.35);
      g.quadraticCurveTo(hx, headCy+headR*1.5, hx+headR*0.6, headCy+headR*0.35);
      g.quadraticCurveTo(hx, headCy+headR*0.75, hx-headR*0.6, headCy+headR*0.35);
    }, dark, Math.max(2,s*0.022));

  return { head:{x:hx,y:headCy}, r:headR };
}

/* -------- FOCUS PLINTH: the two poles the attention swings between -------- */
function drawFocus(pen, cx, baseY, s, which, lit){
  const g = pen.ctx;
  const plinth = toneSolid(inkLevel(lit?7:5));
  // low dark plinth
  pen.paint(()=>{ g.rect(cx-s*0.5, baseY-s*0.6, s, s*0.6); }, plinth, 5);
  pen.paint(()=>{ g.rect(cx-s*0.62, baseY-s*0.6, s*1.24, s*0.12); }, toneSolid(inkLevel(6)), 4);
  // emblem on top
  g.strokeStyle=INK; g.lineWidth=Math.max(3,s*0.06); g.lineCap="round"; g.lineJoin="round";
  if (which==="zeus"){
    // thunderbolt zig-zag
    g.beginPath();
    g.moveTo(cx-s*0.18, baseY-s*1.3); g.lineTo(cx+s*0.05, baseY-s*0.95);
    g.lineTo(cx-s*0.10, baseY-s*0.9);  g.lineTo(cx+s*0.16, baseY-s*0.55);
    g.stroke();
  } else {
    // spear + round shield (Athena)
    g.beginPath(); g.moveTo(cx+s*0.05, baseY-s*1.45); g.lineTo(cx+s*0.05, baseY-s*0.55); g.stroke();
    g.fillStyle=INK; g.beginPath();
    g.moveTo(cx+s*0.05, baseY-s*1.62); g.lineTo(cx-s*0.05, baseY-s*1.4);
    g.lineTo(cx+s*0.15, baseY-s*1.4); g.closePath(); g.fill();
    pen.paint(()=>{ g.ellipse(cx-s*0.24, baseY-s*0.85, s*0.24, s*0.28, 0,0,7); }, toneSolid(inkLevel(4)), 4);
  }
}

/* -------- build the member set deterministically from params + state -------- */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const attention = clamp01(p.attention);
  const wave = clamp01(p.wave);
  const rows = p.formation==="cluster" ? 3 : Math.max(1, p.rows|0);
  const perRow = p.perRow || [7,5];

  const zeusPt   = { x:W*0.15, y:H*0.80 };            // lower-left pole
  const athenaPt = { x:W*0.85, y:H*0.80 };            // lower-right pole

  const members = [];
  for (let r=0; r<rows; r++){
    const depth = rows>1 ? r/(rows-1) : 0;            // 0 = back .. 1 = front
    const n = perRow[Math.min(r, perRow.length-1)] || (7-r);
    const scale = lerp(96, 150, depth);
    const rowY  = H*(0.42 + depth*(p.seatY-0.42));
    const marginX = lerp(0.18, 0.10, depth);
    // front rows offset half a slot so they nest into the back-row gaps
    const stagger = (r%2)*0.5;
    for (let i=0;i<n;i++){
      const t = n>1 ? (i+stagger)/(n-1+stagger) : 0.5;
      const px = lerp(marginX, 1-marginX, clamp01(t));
      let cx = W*px;
      // formation shaping
      let by = rowY;
      if (p.formation!=="rows"){
        // shallow receding curve: ends dip slightly forward toward the poles
        by = rowY + Math.sin(clamp01(t)*Math.PI)*scale*0.14;
      }
      if (p.formation==="cluster"){ cx += (rnd(r*97+i*13)()-0.5)*scale*0.5; }

      // reaction-wave: leftmost heads lead the turn, rightmost lag
      const spread = wave*0.65;
      const localAtt = clamp01(attention*(1+spread) - px*spread);
      const focus = { x:lerp(zeusPt.x, athenaPt.x, localAtt), y:lerp(zeusPt.y, athenaPt.y, localAtt) };
      const headTurn = clamp((focus.x - cx)/(scale*1.35), -1, 1);

      // deterministic identity
      const rng = rnd((r*131+i*17+7)>>>0);
      const feat = {
        beard: rng()<0.5,
        hair:  rng()<0.14 ? "bald" : "full",
        headS: 0.9 + rng()*0.25,
      };
      const shade = {
        robe: Math.round(lerp(3, 4, depth)) + (i%2),   // alternate robes for tonal rhythm
        skin: Math.round(lerp(2, 3, depth)),
        hair: Math.round(lerp(4, 6, depth)),
        seat: Math.round(lerp(2, 3, depth)),
      };
      members.push({ cx, baseY:by, s:scale, shade, headTurn, feat, focus, depth, px });
    }
  }
  return { members, zeusPt, athenaPt, attention, showFocus:p.showFocus, showGaze:p.showGaze };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const { members, zeusPt, athenaPt, attention, showFocus, showGaze } = buildMembers(W, H, st);

  // curved tier benches under the assembly (light — reads as ground/seating)
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.28;
  for (let k=1;k<=3;k++){
    const y = H*(0.42 + k*0.075);
    g.beginPath();
    for (let x=0;x<=W;x+=8){ const t=x/W; const yy = y + Math.sin(t*Math.PI)*22; x===0?g.moveTo(x,yy):g.lineTo(x,yy); }
    g.stroke();
  }
  g.globalAlpha=1;

  // members: already ordered back -> front
  const heads = members.map(m => drawGod(pen, m.cx, m.baseY, m.s, m.shade, m.headTurn, m.feat));

  // faint converging ATTENTION lines from each head toward its focus pole
  if (showGaze){
    g.strokeStyle=INK; g.lineCap="round";
    members.forEach((m,idx)=>{
      const hd = heads[idx];
      g.globalAlpha = 0.16 + 0.12*m.depth;
      g.lineWidth = Math.max(1.5, m.s*0.018);
      const dx = m.focus.x-hd.head.x, dy = m.focus.y-hd.head.y;
      const L = Math.hypot(dx,dy)||1; const ux=dx/L, uy=dy/L;
      const len = L*0.55;                // reach most of the way to the pole
      g.beginPath();
      g.moveTo(hd.head.x+ux*hd.r*0.8, hd.head.y+uy*hd.r*0.8);
      g.lineTo(hd.head.x+ux*(hd.r*0.8+len), hd.head.y+uy*(hd.r*0.8+len));
      g.stroke();
    });
    g.globalAlpha=1;
  }

  // the two foreground focus poles (Zeus dim as attention leaves, Athena lit as it arrives)
  if (showFocus){
    drawFocus(pen, zeusPt.x,   zeusPt.y,   W*0.10, "zeus",   attention<0.5);
    drawFocus(pen, athenaPt.x, athenaPt.y, W*0.10, "athena", attention>=0.5);
  }
}

export const asset = {
  id:"ensemble.assembly-of-gods",
  type:"ENSEMBLE",
  name:"Assembly of gods",
  statusWord:"RAPT",
  scene:"OD-B01-S01",

  params,
  // back -> front draw order the ensemble honors
  layers:["benches","back-row","mid-row","front-row","gaze-lines","focus-zeus","focus-athena"],
  // normalized 0..1 anchors: the two attention poles + placement handles
  anchors:{
    "focus:zeus":{x:.12,y:.88},   "focus:athena":{x:.88,y:.88},
    "row:back":{x:.50,y:.42},     "row:front":{x:.50,y:.66},
    "center":{x:.50,y:.56},       "camera:wide":{x:.50,y:.52},
  },
  zones:{ assembly:{ x0:.06,y0:.36,x1:.94,y1:.74 } },
  states:{
    initial:"attending-zeus",
    nodes:{
      // all heads rapt on Zeus (left pole), no ripple yet
      "attending-zeus":  { preview:{ attention:0.0, wave:0.25, status:"ATTENDING" } },
      // the collective turn in mid-sweep — heads ripple left->right
      "turning":         { preview:{ attention:0.5, wave:0.9,  status:"TURNING" } },
      // attention arrived: all heads on Athena (right pole)
      "attending-athena":{ preview:{ attention:1.0, wave:0.25, status:"ATTENDING" } },
      // a startled reaction wave through the seated ranks
      "stirred":         { preview:{ attention:0.7, wave:1.0,  formation:"cluster", status:"STIRRED" } },
    },
    edges:[
      ["attending-zeus","turning"],["turning","attending-athena"],
      ["turning","stirred"],["stirred","attending-athena"],
      ["attending-athena","attending-zeus"],
    ],
  },
  channels:["attention","wave","density","formation","depth"],

  // neutral preview = the turn caught in motion (reads as "attention on the move")
  preview:()=>({ attention:0.35, wave:0.8, formation:"arc", status:"RAPT", progress:0.35 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
