/* ensemble.feast-listeners — the silent hall listening to the bard.
   ENSEMBLE asset. Scene function (OD-B08-S02): a SEATED audience at the feast,
   every listener oriented toward the bard (a small station on the left), sitting
   still and silent — while ONE hidden listener among them weeps, a reaction that
   escapes most of the others. Built from ONE separable member template
   (drawListener) instanced N times deterministically across arced rows.

   Exposes formation (audience-arc), density (rows/perRow), attention (all-to-bard
   pull that leans torsos and turns heads toward the focus), foreground/background
   depth, and the single REACTION-OUTLIER channel: `outlier` (which member weeps)
   + `grief` (how strongly the hidden reaction shows). Drawn in SOLID grays + hard
   contour; the engine dotify pass supplies the halftone. The bard himself is NOT
   baked in — only a small diagrammatic stool+lyre focus the listeners face. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

const params = {
  formation:"arc",         // arc | rows  (audience-arc curls the ranks toward the bard)
  rows:3,                  // depth tiers (back..front)
  perRow:[5,5,4],          // members per tier (density)
  focus:{ x:0.155, y:0.48 },// the bard station the whole hall faces (0..1)
  attention:0.9,           // all-to-bard pull: 0=slack .. 1=leaning, heads fully turned
  outlier:0.52,            // WHICH member weeps, as a position 0..1 through the seated set
  grief:0.85,              // how strongly the hidden reaction shows on that one member
  showFocus:true,          // draw the small stool + lyre glyph the hall faces
  showLines:true,          // faint sightlines from the ranks to the bard
  groundY:0.90,            // front-row seat line as fraction of H
};

/* ---------------- one arm, shoulder->elbow->wrist (elbow sags) ---------------- */
function armTo(pen, sh, wr, tone, w){
  const mx=(sh.x+wr.x)/2, my=(sh.y+wr.y)/2;
  const el={ x:mx + (wr.x-sh.x)*0.06, y:my + Math.abs(wr.x-sh.x)*0.10 + w*0.5 };
  pen.limb(()=>{ pen.ctx.moveTo(sh.x,sh.y); pen.ctx.lineTo(el.x,el.y); }, tone, w);
  pen.limb(()=>{ pen.ctx.moveTo(el.x,el.y); pen.ctx.lineTo(wr.x,wr.y); }, tone, w*0.86);
  return el;
}

/* ============================================================
   ONE member template — a SEATED listener, cross-legged on the hall floor,
   torso rising from a low lap-mound, head turned toward the bard (faceDir).
   Reaction is packed on the member: `grief` (0 = calm/silent, >0 = the hidden
   weeper: head bows, a hand lifts to the face, a blue tear falls).
   ============================================================ */
function drawListener(pen, m){
  const g = pen.ctx, s = m.s;
  const dir = m.faceDir;                       // -1 => faces the bard on the left
  const tunic = toneSolid(inkLevel(m.shade.tunic));
  const skin  = toneSolid(inkLevel(m.shade.skin));
  const lap   = toneSolid(inkLevel(m.shade.lap));
  const dark  = toneSolid(inkLevel(m.shade.hair));
  const lw    = Math.max(2, s*0.026);
  const grief = m.grief;

  const seatY   = m.baseY;
  const hipHalf = s*0.135;
  const hipY    = seatY - s*0.05;
  const torsoLen= s*0.30;
  const shoHalf = s*0.155;
  const lean    = m.lean;                       // px lean of the shoulders toward the bard
  const shoCx   = m.cx + lean;
  const shoY    = hipY - torsoLen + grief*s*0.03;   // weeper sinks/curls a touch
  const headR   = s*0.115*m.feat.headS;

  // ---- folded-leg LAP mound in front of the hips, toward the bard ----
  pen.paint(()=>{
    g.ellipse(m.cx + dir*s*0.05, seatY - s*0.01, s*0.20, s*0.11, 0, 0, 7);
  }, lap, lw);
  // knee bumps read the cross-legged fold
  pen.seam(()=>{ g.moveTo(m.cx - s*0.14, seatY - s*0.02); g.quadraticCurveTo(m.cx + dir*s*0.02, seatY - s*0.09, m.cx + s*0.14, seatY - s*0.02); }, Math.max(1.5,s*0.014));

  // ---- torso: tunic trapezoid hips -> shoulders (leaning toward the bard) ----
  pen.paint(()=>{
    g.moveTo(m.cx - hipHalf, hipY);
    g.lineTo(m.cx + hipHalf, hipY);
    g.lineTo(shoCx + shoHalf, shoY);
    g.lineTo(shoCx - shoHalf, shoY);
    g.closePath();
  }, tunic, lw);
  // chiton fold seams
  pen.seam(()=>{ g.moveTo(shoCx, shoY+s*0.02); g.lineTo(m.cx, hipY); }, Math.max(1.5,s*0.014));
  pen.seam(()=>{ g.moveTo(shoCx - shoHalf*0.5, shoY+s*0.03); g.lineTo(m.cx - hipHalf*0.55, hipY); }, Math.max(1.3,s*0.012));

  // ---- shoulders + neck ----
  const shFront = { x: shoCx + dir*shoHalf*0.92, y: shoY + s*0.012 };  // shoulder toward bard
  const shBack  = { x: shoCx - dir*shoHalf*0.92, y: shoY + s*0.012 };  // shoulder away from bard
  const armW    = Math.max(3, s*0.058);

  // head geometry: turned toward the bard; the weeper bows it down + toward the lap
  const headTurn = m.headTurn;                       // negative => turned to the bard (left)
  const bow      = grief*headR*0.85;                 // downward bow of the weeper's head
  const headCx   = shoCx + dir*headR*0.16 + headTurn*headR*0.10 + grief*dir*headR*0.25;
  const headCy   = shoY - headR*1.0 - s*0.015 + bow;

  // neck
  pen.paint(()=>{ g.rect(headCx - headR*0.28, shoY - headR*0.5, headR*0.56, headR*0.8); }, skin, Math.max(2,s*0.016));

  // ---- FAR arm (shoulder away from bard) — rests on the lap ----
  const farWrist = { x: m.cx - dir*s*0.03, y: hipY - s*0.01 };
  armTo(pen, shBack, farWrist, tunic, armW*0.9);

  // ---- head ----
  if (m.feat.hair!=="bald")
    pen.paint(()=>{ g.ellipse(headCx, headCy+headR*0.10, headR*1.12, headR*1.18, 0,0,7); }, dark, Math.max(2,s*0.024));
  pen.paint(()=>{ g.ellipse(headCx, headCy, headR*0.92, headR, 0,0,7); }, skin, Math.max(2,s*0.026));

  // ---- face (profile toward the bard) : eyes/brow/nose/mouth ----
  const gx   = headTurn*headR*0.30;
  const eyeY = headCy - headR*0.05 + grief*headR*0.12;
  const eyeR = headR*0.11;
  const eL = headCx - headR*0.34 + gx, eR = headCx + headR*0.34 + gx;
  g.fillStyle = INK;
  // strong left turn => mostly the bard-side eye shows (a clean profile)
  const showBack = headTurn > -0.55, showFront = headTurn < 0.55;
  if (showFront){ g.beginPath(); g.ellipse(eL, eyeY, eyeR, eyeR*(grief>0.3?0.7:1.1), 0,0,7); g.fill(); }
  if (showBack){ g.beginPath(); g.ellipse(eR, eyeY, eyeR, eyeR*1.1, 0,0,7); g.fill(); }
  // brow (drops and knits for the weeper)
  g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.15); g.lineCap="round";
  g.beginPath();
  g.moveTo(headCx - headR*0.5 + gx, eyeY - headR*0.32 + grief*headR*0.14);
  g.lineTo(headCx + headR*0.5 + gx, eyeY - headR*0.30 + grief*headR*0.02);
  g.stroke();
  // nose points toward the bard
  g.lineWidth=Math.max(2,headR*0.12);
  g.beginPath();
  g.moveTo(headCx + gx*0.5, eyeY + headR*0.12);
  g.lineTo(headCx + dir*headR*0.42, eyeY + headR*0.44);
  g.stroke();
  // mouth: silent listeners keep a closed level line; the weeper's turns down
  g.lineWidth=Math.max(2,headR*0.12);
  g.beginPath();
  const mY = headCy + headR*0.52;
  if (grief>0.25){
    g.moveTo(headCx - headR*0.24 + gx, mY - headR*0.02);
    g.quadraticCurveTo(headCx + gx, mY + headR*0.22, headCx + headR*0.24 + gx, mY - headR*0.02);
  } else {
    g.moveTo(headCx - headR*0.20 + gx, mY);
    g.lineTo(headCx + headR*0.20 + gx, mY);
  }
  g.stroke();

  // hair front cap + optional beard
  if (m.feat.hair!=="bald")
    pen.paint(()=>{
      g.moveTo(headCx-headR*0.95, headCy-headR*0.02);
      g.quadraticCurveTo(headCx, headCy-headR*1.32, headCx+headR*0.95, headCy-headR*0.02);
      g.quadraticCurveTo(headCx+headR*0.5, headCy-headR*0.5, headCx, headCy-headR*0.42);
      g.quadraticCurveTo(headCx-headR*0.5, headCy-headR*0.5, headCx-headR*0.95, headCy-headR*0.02);
    }, dark, Math.max(2,s*0.02));
  if (m.feat.beard)
    pen.paint(()=>{
      g.moveTo(headCx-headR*0.52, headCy+headR*0.32);
      g.quadraticCurveTo(headCx, headCy+headR*1.38, headCx+headR*0.52, headCy+headR*0.32);
      g.quadraticCurveTo(headCx, headCy+headR*0.66, headCx-headR*0.52, headCy+headR*0.32);
    }, dark, Math.max(2,s*0.018));

  // ---- NEAR arm (bard-side shoulder) : on the lap, OR lifted to the face if weeping ----
  if (grief>0.4){
    // hand rises to cover/wipe the face — the hidden reaction
    const faceWrist = { x: headCx + dir*headR*0.30, y: headCy + headR*0.38 };
    armTo(pen, shFront, faceWrist, tunic, armW);
    pen.paint(()=>{ g.ellipse(faceWrist.x, faceWrist.y, headR*0.32, headR*0.26, 0,0,7); }, skin, lw*0.8);
  } else {
    const nearWrist = { x: m.cx + dir*s*0.10, y: hipY - s*0.01 };
    armTo(pen, shFront, nearWrist, tunic, armW);
  }

  // ---- the hidden reaction: a single blue tear falling from the bard-side eye ----
  if (grief>0.35){
    g.fillStyle=ACCENT;
    const tx = eL, ty0 = eyeY + eyeR*1.2;
    g.beginPath();
    g.ellipse(tx, ty0 + grief*headR*0.5, headR*0.07, headR*0.11, 0, 0, 7);
    g.fill();
  }

  return { head:{ x:headCx, y:headCy }, r:headR, grief, focusX:m.focusX, focusY:m.focusY };
}

/* -------- the bard STATION the hall faces (NOT the bard himself) --------
   A small diagram: a low stool + an upright lyre glyph, so orientation reads.
   Kept faint and clearly schematic, like the omen sign in other ensembles. */
function drawFocus(pen, x, y, s){
  const g = pen.ctx;
  // stool
  pen.paint(()=>{ g.rect(x - s*0.34, y + s*0.10, s*0.68, s*0.16); }, toneSolid(inkLevel(5)), Math.max(2,s*0.05));
  pen.ink(()=>{ g.moveTo(x - s*0.28, y + s*0.26); g.lineTo(x - s*0.24, y + s*0.5); }, Math.max(2,s*0.05));
  pen.ink(()=>{ g.moveTo(x + s*0.28, y + s*0.26); g.lineTo(x + s*0.24, y + s*0.5); }, Math.max(2,s*0.05));
  // lyre: two curved arms + a crossbar + strings
  g.strokeStyle=INK; g.lineCap="round"; g.lineJoin="round"; g.lineWidth=Math.max(3,s*0.08);
  g.beginPath();
  g.moveTo(x - s*0.20, y + s*0.08);
  g.quadraticCurveTo(x - s*0.42, y - s*0.30, x - s*0.16, y - s*0.62);
  g.stroke();
  g.beginPath();
  g.moveTo(x + s*0.20, y + s*0.08);
  g.quadraticCurveTo(x + s*0.42, y - s*0.30, x + s*0.16, y - s*0.62);
  g.stroke();
  g.beginPath(); g.moveTo(x - s*0.20, y - s*0.56); g.lineTo(x + s*0.20, y - s*0.56); g.stroke(); // crossbar
  // sound-hole body + strings
  pen.paint(()=>{ g.ellipse(x, y + s*0.02, s*0.20, s*0.24, 0,0,7); }, toneSolid(inkLevel(3)), Math.max(2,s*0.05));
  g.strokeStyle=INK; g.lineWidth=Math.max(1.5,s*0.03);
  for (let k=-2;k<=2;k++){ g.beginPath(); g.moveTo(x + k*s*0.06, y - s*0.54); g.lineTo(x + k*s*0.06, y + s*0.02); g.stroke(); }
  // a single blue note-mark rising (the song)
  g.fillStyle=ACCENT; g.beginPath(); g.arc(x + s*0.02, y - s*0.78, Math.max(3,s*0.09), 0, 7); g.fill();
  g.strokeStyle=ACCENT; g.lineWidth=Math.max(2,s*0.05);
  g.beginPath(); g.moveTo(x + s*0.02 + s*0.09, y - s*0.78); g.lineTo(x + s*0.02 + s*0.09, y - s*1.05); g.stroke();
}

/* ============================================================
   build the seated set deterministically from params + state.
   The `outlier` scalar selects the single weeping member by position; every
   other member gets grief=0. Attention scales lean + head-turn toward the bard.
   ============================================================ */
function buildMembers(W, H, st){
  const p = { ...params, ...st, focus:{ ...params.focus, ...(st&&st.focus||{}) } };
  const attention = clamp01(p.attention);
  const grief0 = clamp01(p.grief);
  const outPos = clamp01(p.outlier);
  const rows = Math.max(1, p.rows|0);
  const perRow = p.perRow || [5,5,4];
  const fx = p.focus.x*W, fy = p.focus.y*H;

  // enumerate seats first so the outlier can be chosen by global position
  const seats = [];
  for (let r=0;r<rows;r++){
    const depth = rows>1 ? r/(rows-1) : 0;            // 0=back .. 1=front
    const n = perRow[Math.min(r, perRow.length-1)] || 4;
    for (let i=0;i<n;i++) seats.push({ r, i, n, depth });
  }
  const total = seats.length;
  const outIdx = Math.round(outPos*(total-1));

  const members = [];
  seats.forEach((seat, idx)=>{
    const { r, i, n, depth } = seat;
    const scale  = lerp(140, 222, depth);              // back small .. front large
    const rowY   = H*(0.32 + depth*(p.groundY-0.32));
    const marginX= lerp(0.42, 0.30, depth);           // audience sits right of the bard
    const stagger= (r%2)*0.5;
    const t  = n>1 ? (i+stagger)/(n-1+stagger) : 0.5;
    const px = clamp01(lerp(marginX, 0.95, clamp01(t)));
    let cx = W*px;
    let by = rowY;
    // audience-ARC: the rank curls around the bard — near end drops, far end lifts
    if (p.formation==="arc"){
      const a = (px - marginX)/(0.95 - marginX);       // 0 near bard .. 1 far
      by += Math.sin(a*Math.PI)* -scale*0.10 + a*scale*0.05;
      cx += Math.sin(a*Math.PI)* -scale*0.02;
    }

    const rng = rnd((r*151+i*23+11)>>>0);
    const feat = { beard: rng()<0.5, hair: rng()<0.14?"bald":"full", headS: 0.9+rng()*0.2 };

    // orientation toward the bard: everyone faces left; farther seats turn a touch more
    const dir = (fx <= cx) ? -1 : 1;
    const turnMag = lerp(0.55, 0.86, clamp01((px-0.28)/0.67)) * attention;
    const headTurn = dir*turnMag;                       // negative => turned to the bard
    const lean = dir * scale*0.05 * attention;          // torso leans toward the bard

    const isOut = idx===outIdx;
    const grief = isOut ? grief0 : 0;

    members.push({
      cx, baseY:by, s:scale, depth, px, faceDir:dir, headTurn, lean, grief,
      focusX:fx, focusY:fy, feat,
      shade:{
        tunic: Math.round(lerp(2, 3.4, depth)) + (i%2===0?0:1),
        skin:  Math.round(lerp(1, 2.4, depth)),
        lap:   Math.round(lerp(3, 4.4, depth)),
        hair:  Math.round(lerp(3, 5, depth)),
      },
    });
  });

  // draw back -> front so front rows occlude the back
  members.sort((a,b)=> a.baseY - b.baseY);
  return { members, attention, focus:{ x:fx, y:fy }, showFocus:p.showFocus, showLines:p.showLines };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);

  // faint hall floor rules under the seated ranks
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.16;
  for (let k=0;k<=3;k++){ const y=H*(0.55+k*0.11); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha=1;

  // faint sightlines converging on the bard station (the all-to-bard attention)
  if (B.showLines && B.attention>0.05){
    g.strokeStyle=INK; g.lineCap="round";
    for (let i=0;i<6;i++){
      const fxp = lerp(W*0.42, W*0.92, i/5), fyp = lerp(H*0.5, H*0.82, ((i*3)%6)/6);
      g.globalAlpha = 0.08*B.attention; g.lineWidth = 2;
      g.beginPath(); g.moveTo(B.focus.x + W*0.02, B.focus.y - H*0.02); g.lineTo(fxp, fyp); g.stroke();
    }
    g.globalAlpha=1;
  }

  // the bard STATION on the left (small stool + lyre glyph the hall faces)
  if (B.showFocus) drawFocus(pen, B.focus.x, B.focus.y, W*0.11);

  // seated members, back -> front
  const heads = B.members.map(m => drawListener(pen, m));

  // mark the ONE hidden reaction with a faint outlier bracket the crowd misses
  const weep = heads.find(h=>h.grief>0.35);
  if (weep){
    g.strokeStyle=ACCENT; g.globalAlpha=0.55; g.lineWidth=Math.max(2,W*0.004);
    const x=weep.head.x, y=weep.head.y, r=weep.r*1.9;
    g.beginPath();
    g.arc(x, y, r, Math.PI*0.15, Math.PI*0.85); g.stroke();          // a quiet half-ring, easy to miss
    g.globalAlpha=1;
  }
}

export const asset = {
  id:"ensemble.feast-listeners",
  type:"ENSEMBLE",
  name:"Feast listeners",
  statusWord:"RAPT",
  scene:"OD-B08-S02",

  params,
  // back -> front draw order the ensemble honors
  layers:["floor","sightlines","focus","back-row","mid-row","front-row","outlier-mark"],
  // normalized 0..1 anchors: the bard focus, seat handles, the hidden weeper
  anchors:{
    "focus:bard":{x:.135,y:.58}, "focus:lyre":{x:.135,y:.50},
    "row:back":{x:.62,y:.46}, "row:mid":{x:.60,y:.62}, "row:front":{x:.58,y:.82},
    "seat:near":{x:.42,y:.72}, "seat:far":{x:.92,y:.55},
    "outlier:weeper":{x:.60,y:.66}, "camera:wide":{x:.52,y:.56},
  },
  zones:{ audience:{ x0:.30,y0:.42,x1:.97,y1:.94 }, aisle:{ x0:.20,y0:.50,x1:.30,y1:.90 } },
  states:{
    initial:"listening",
    nodes:{
      // silent, seated, all turned to the bard — the hidden weeper barely shows
      listening:{ preview:{ attention:0.9, grief:0.55, outlier:0.52, status:"LISTENING" } },
      // the hall leans in, rapt; the song has taken hold
      rapt:{ preview:{ attention:1.0, grief:0.3, outlier:0.52, status:"RAPT" } },
      // the hidden reaction escapes — one listener openly weeps, unseen by the rest
      "one-weeps":{ preview:{ attention:0.85, grief:0.95, outlier:0.52, status:"WEEPING" } },
      // attention slackens between songs; nobody reacting
      idle:{ preview:{ attention:0.45, grief:0.0, outlier:0.52, status:"IDLE" } },
    },
    edges:[
      ["listening","rapt"],["rapt","one-weeps"],["one-weeps","listening"],
      ["listening","idle"],["idle","listening"],
    ],
  },
  channels:["attention","formation","density","outlier","grief","depth","focus"],

  // neutral preview = the silent hall, rapt on the bard, the one hidden reaction just breaking
  preview:()=>({ attention:0.92, grief:0.72, outlier:0.52, formation:"arc",
                 status:"RAPT", progress:0.42 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
