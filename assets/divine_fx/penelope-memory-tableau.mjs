/* divine_fx.penelope-memory-tableau — the whole household plot compressed into
   one ghostly testimony image. DIVINE_FX.
   Scene function (OD-B24-S02): Amphimedon's shade tells the dead how Penelope
   beat them. Four faint memory-cells stacked as registers —
     I   LOOM      the shroud woven by day and unpicked by night (the delay)
     II  BEGGAR    the ragged stranger crossing the threshold, watched
     III CONTEST   the bow braced, the arrow through the twelve axe-hafts
     IV  RECOGNIT. the rooted olive bed and the two bodies joined again
   Procedural: source (a shade's spoken testimony) -> field (four ghost cells +
   a downward time-thread in the gutter) -> transform (the cell the telling is
   dwelling in brightens and hardens its frame, swept over state.t) -> visible
   consequence (the thread terminates in a solid mark: the story fixed as song,
   Penelope's fame, which is what the underworld takes away from the telling).
   Solid grays + hard contour only; the engine POST pass supplies the halftone —
   do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const frac = x => x - Math.floor(x);

const params = {
  period:   8.0,     // seconds for the testimony to sweep loom->beggar->contest->recognition
  panelX0:  0.165,   // left edge of the cells (leaves the time-thread gutter)
  panelX1:  0.950,
  regs: [            // the four stacked memory-cells, y as frac of H
    { key:"loom",        y0:0.082, y1:0.285 },
    { key:"beggar",      y0:0.297, y1:0.500 },
    { key:"contest",     y0:0.512, y1:0.715 },
    { key:"recognition", y0:0.727, y1:0.930 },
  ],
  ghost:  0.46,      // base glow floor: unvisited cells stay legible, not blank
  axes:   12,        // the twelve axe-hafts the arrow passes
  source: "character.amphimedons-shade",          // who is telling it
  target: "ensemble.warrior-shades",              // who it lands on
  field:  "the asphodel air above the assembly",  // where the tableau hangs
};

/* ---- blocky silhouette FIGURE from round-capped limbs + a head. Local unit is
   the figure height h; origin at the feet midpoint (ox, gy); dir flips facing.
   Returns the joint table so callers can hang a bow / staff / thread off it. --- */
function fig(pen, g, ox, gy, h, tone, dir, pose, lw){
  const P = (lx,ly)=>({ x: ox + lx*h*dir, y: gy - ly*h });
  let J;
  if (pose==="weave"){            // arms up into the warp, working the shuttle
    J = {
      hip:P(-.02,.46), sh:P(.05,.80), neck:P(.06,.86), head:P(.07,.965), hr:h*.105,
      hipL:P(-.09,.46), hipR:P(.05,.46),
      kneeB:P(-.10,.23), footB:P(-.15,0),
      kneeF:P(.08,.23), footF:P(.13,0),
      shA:P(.10,.80), elA:P(.26,.86), wrA:P(.34,1.00),
      shB:P(.02,.80), elB:P(.16,.72), wrB:P(.30,.80),
    };
  } else if (pose==="stoop"){     // the beggar: bent back, staff in the near hand
    J = {
      hip:P(-.06,.44), sh:P(.06,.74), neck:P(.10,.79), head:P(.17,.865), hr:h*.10,
      hipL:P(-.12,.44), hipR:P(0,.44),
      kneeB:P(-.16,.22), footB:P(-.27,.01),
      kneeF:P(.08,.21), footF:P(.17,0),
      shA:P(.08,.74), elA:P(.18,.60), wrA:P(.24,.50), staff:true,
      shB:P(.04,.74), elB:P(-.06,.60), wrB:P(-.10,.48),
    };
  } else if (pose==="brace"){     // kneeling archer, bow arm out, draw hand at the cheek
    J = {
      hip:P(-.02,.34), sh:P(.02,.62), neck:P(.03,.68), head:P(.05,.78), hr:h*.095,
      hipL:P(-.08,.34), hipR:P(.04,.34),
      kneeB:P(-.20,.12), footB:P(-.35,.02),
      kneeF:P(.20,.30), footF:P(.27,0),
      shA:P(.08,.62), elA:P(.26,.63), wrA:P(.44,.64),
      shB:P(-.02,.62), elB:P(-.14,.56), wrB:P(.02,.70), bow:true,
    };
  } else if (pose==="embrace"){   // leaning into the partner, both arms round them
    J = {
      hip:P(0,.46), sh:P(.08,.78), neck:P(.10,.84), head:P(.14,.935), hr:h*.10,
      hipL:P(-.07,.46), hipR:P(.06,.46),
      kneeB:P(-.10,.23), footB:P(-.14,0),
      kneeF:P(.09,.23), footF:P(.14,0),
      shA:P(.14,.78), elA:P(.26,.70), wrA:P(.35,.78),
      shB:P(.04,.76), elB:P(.18,.62), wrB:P(.31,.62),
    };
  } else {                        // stand
    J = {
      hip:P(0,.46), sh:P(0,.80), neck:P(0,.86), head:P(0,.965), hr:h*.10,
      hipL:P(-.08,.46), hipR:P(.08,.46),
      kneeB:P(-.08,.23), footB:P(-.09,0),
      kneeF:P(.08,.23), footF:P(.09,0),
      shA:P(.13,.80), elA:P(.16,.62), wrA:P(.16,.44),
      shB:P(-.13,.80), elB:P(-.16,.62), wrB:P(-.16,.44),
    };
  }
  const L = lw;
  // back leg + far arm first (behind the torso, for depth)
  pen.limb(()=>{ g.moveTo(J.hipL.x,J.hipL.y); g.lineTo(J.kneeB.x,J.kneeB.y); g.lineTo(J.footB.x,J.footB.y); }, tone, L*0.92);
  pen.limb(()=>{ g.moveTo(J.shB.x,J.shB.y); g.lineTo(J.elB.x,J.elB.y); g.lineTo(J.wrB.x,J.wrB.y); }, tone, L*0.70);
  // torso
  pen.limb(()=>{ g.moveTo(J.hip.x,J.hip.y); g.lineTo(J.sh.x,J.sh.y); }, tone, L*1.50);
  // front leg
  pen.limb(()=>{ g.moveTo(J.hipR.x,J.hipR.y); g.lineTo(J.kneeF.x,J.kneeF.y); g.lineTo(J.footF.x,J.footF.y); }, tone, L*0.97);
  // neck + head
  pen.limb(()=>{ g.moveTo(J.sh.x,J.sh.y); g.lineTo(J.neck.x,J.neck.y); }, tone, L*0.70);
  pen.paint(()=>{ g.arc(J.head.x,J.head.y,J.hr,0,TAU); }, tone, 4);
  // near arm
  pen.limb(()=>{ g.moveTo(J.shA.x,J.shA.y); g.lineTo(J.elA.x,J.elA.y); g.lineTo(J.wrA.x,J.wrA.y); }, tone, L*0.76);
  if (J.staff){ const sx=J.wrA.x; pen.ink(()=>{ g.moveTo(sx, gy); g.lineTo(sx, gy-h*0.98); }, Math.max(3,L*0.45)); }
  return J;
}

/* ---- I · the warp-weighted loom: the web hangs from the cloth beam and is
   eaten back to a stepped working edge; below it the bare warp drops to its
   weights. Woven by day down to there, unpicked by night back up. ---- */
function drawLoom(pen,g,cx,gy,w,ht){
  const x0=cx-w/2, x1=cx+w/2, top=gy-ht, pw=w*0.085;
  pen.paint(()=>{ g.rect(x0-pw, top, pw, ht*0.97); }, toneSolid(inkLevel(3)), 3.5);      // left upright
  pen.paint(()=>{ g.rect(x1, top, pw, ht*0.97); }, toneSolid(inkLevel(3)), 3.5);         // right upright
  pen.paint(()=>{ g.rect(x0-pw, top, w+pw*2, ht*0.075); }, toneSolid(inkLevel(5)), 3.5); // cloth beam
  const beam = top + ht*0.075;
  const steps=5, bot=k=>beam + ht*(0.30 - k*0.042);      // working edge: deep right, eaten left
  // bare warp dropping to its weights
  for (let i=1;i<=7;i++){ const x=lerp(x0,x1,i/8);
    pen.ink(()=>{ g.moveTo(x, beam); g.lineTo(x, gy-ht*0.11); }, 2.4);
    pen.paint(()=>{ g.rect(x-w*0.028, gy-ht*0.11, w*0.056, ht*0.09); }, toneSolid(inkLevel(4)), 2.2); }
  // the woven web hanging off the beam — light cloth, hard edge
  pen.paint(()=>{
    g.moveTo(x0, beam); g.lineTo(x1, beam);
    for(let k=0;k<steps;k++){
      const xa=lerp(x1,x0,k/steps), xb=lerp(x1,x0,(k+1)/steps);
      g.lineTo(xa, bot(k)); g.lineTo(xb, bot(k));
    }
    g.closePath();
  }, toneSolid(inkLevel(2)), 3.5);
  // broken weft rules inside the web (never a full span)
  for(let r=1;r<=2;r++){ const y=beam+ht*0.072*r;
    pen.ink(()=>{ g.moveTo(x0+w*0.08, y); g.lineTo(x0+w*0.38, y); }, 2.2);
    pen.ink(()=>{ g.moveTo(x0+w*0.52, y); g.lineTo(x1-w*0.06, y); }, 2.2); }
  // threads pulled loose off the eaten edge — the night's work
  for(let k=0;k<3;k++){ const sx=lerp(x0+w*0.12, cx-w*0.02, k/2), sy=bot(steps-1-k)+ht*0.008;
    pen.ink(()=>{ g.moveTo(sx,sy);
      g.quadraticCurveTo(sx-w*0.11, sy+ht*0.10, sx+w*0.05, sy+ht*0.19); }, 2.4); }
}

/* ---- II · the hall doorway the stranger is let through ---- */
function drawDoorway(pen,g,x,gy,w,ht){
  const x0=x-w/2, x1=x+w/2, top=gy-ht;
  g.fillStyle=inkLevel(1); g.beginPath(); g.rect(x0, top+ht*0.14, w, ht*0.86); g.fill();
  pen.paint(()=>{ g.rect(x0-w*0.16, top+ht*0.12, w*0.16, ht*0.88); }, toneSolid(inkLevel(4)), 3.5);
  pen.paint(()=>{ g.rect(x1, top+ht*0.12, w*0.16, ht*0.88); }, toneSolid(inkLevel(4)), 3.5);
  pen.paint(()=>{ g.rect(x0-w*0.16, top, w*1.32, ht*0.14); }, toneSolid(inkLevel(5)), 3.5);
  // threshold stone under the opening only
  pen.paint(()=>{ g.rect(x0-w*0.16, gy-ht*0.045, w*1.32, ht*0.045); }, toneSolid(inkLevel(5)), 3);
}

/* ---- III · the twelve axe-hafts: each a stake broken by a paper gap at
   arrow height, the whole line pierced by one flight ---- */
function drawAxes(pen,g,ax0,ax1,gy,ht,gapY,n){
  const pitch=(ax1-ax0)/(n-1), sw=Math.max(3.2, pitch*0.22), gh=ht*0.17, top=gy-ht;
  for(let i=0;i<n;i++){
    const x=ax0+i*pitch;
    pen.paint(()=>{ g.rect(x-sw/2, gapY+gh/2, sw, gy-(gapY+gh/2)); }, toneSolid(inkLevel(3)), 2.6); // haft below the eye
    pen.paint(()=>{ g.rect(x-sw/2, top+ht*0.11, sw, (gapY-gh/2)-(top+ht*0.11)); }, toneSolid(inkLevel(3)), 2.6);
    // one-sided axe head at the top of the haft
    pen.paint(()=>{ g.moveTo(x-sw*0.5, top); g.lineTo(x+sw*1.7, top+ht*0.022);
      g.lineTo(x+sw*1.7, top+ht*0.098); g.lineTo(x-sw*0.5, top+ht*0.12); g.closePath();
    }, toneSolid(inkLevel(5)), 2.6);
  }
  // the trench the hafts are set in — two broken runs, never one rule
  pen.ink(()=>{ g.moveTo(ax0-pitch*0.6, gy); g.lineTo(ax0+pitch*4.4, gy); }, 3);
  pen.ink(()=>{ g.moveTo(ax0+pitch*5.3, gy); g.lineTo(ax1+pitch*0.6, gy); }, 3);
}

/* ---- IV · the rooted olive bed: one leg is a living trunk, which is the proof ---- */
function drawBed(pen,g,cx,gy,w,ht){
  const x0=cx-w/2, x1=cx+w/2, deck=gy-ht*0.58, th=ht*0.15;
  pen.paint(()=>{ g.rect(x0+w*0.06, deck, w*0.94, th); }, toneSolid(inkLevel(3)), 3.5);       // bed frame
  pen.paint(()=>{ g.rect(x0+w*0.24, deck-ht*0.16, w*0.32, ht*0.16); }, toneSolid(inkLevel(2)), 3); // bolster, on the deck
  for(let k=1;k<=4;k++){ const x=lerp(x0+w*0.58, x1-w*0.06, k/5);                              // cords across the frame
    pen.ink(()=>{ g.moveTo(x, deck+th*0.18); g.lineTo(x, deck+th*0.82); }, 2.2); }
  pen.paint(()=>{ g.rect(x1-w*0.14, deck+th, w*0.12, gy-(deck+th)); }, toneSolid(inkLevel(4)), 3); // cut leg
  // the olive: this bedpost is a living trunk, still standing in its own roots
  pen.paint(()=>{ g.rect(x0+w*0.02, gy-ht*1.16, w*0.16, ht*1.14); }, toneSolid(inkLevel(5)), 3.5);
  pen.ink(()=>{ g.moveTo(x0+w*0.18, gy-ht*1.06); g.lineTo(x0+w*0.38, gy-ht*1.20); }, 3.2);    // lopped branch
  for(let k=-1;k<=1;k+=2){ const rx=x0+w*0.10;
    pen.ink(()=>{ g.moveTo(rx, gy-ht*0.09);
      g.quadraticCurveTo(rx+k*w*0.14, gy-ht*0.05, rx+k*w*0.26, gy-ht*0.005); }, 3.2); }       // roots
}

/* ---- one memory-cell: ghost field, setting, figures, frame ---- */
function drawRegister(pen,g,W,H,reg,idx,glow){
  const x0=W*params.panelX0, x1=W*params.panelX1, pw=x1-x0;
  const ry0=H*reg.y0, ry1=H*reg.y1, rh=ry1-ry0;
  const gy = ry1 - H*0.014;
  const h  = rh*0.60;
  const lvl = clamp(Math.round(3.4 + glow*2.0), 3, 6);
  const tone = toneSolid(inkLevel(lvl));
  const near = toneSolid(inkLevel(clamp(lvl-1,2,5)));
  const lw = h*0.058;

  g.save();
  g.beginPath(); g.rect(x0, ry0, pw, rh); g.clip();
  g.fillStyle=inkLevel(1); g.fillRect(x0, ry0, pw, rh);        // faint ghost field
  // floor, broken at the middle so it does not stripe the frame
  pen.ink(()=>{ g.moveTo(x0+pw*0.03, gy); g.lineTo(x0+pw*0.46, gy); }, 3);
  pen.ink(()=>{ g.moveTo(x0+pw*0.54, gy); g.lineTo(x1-pw*0.03, gy); }, 3);

  if (reg.key==="loom"){
    drawLoom(pen,g, x0+pw*0.71, gy, pw*0.26, h*1.22);
    fig(pen,g, x0+pw*0.38, gy, h, tone, 1, "weave", lw);                      // Penelope at the warp
  } else if (reg.key==="beggar"){
    drawDoorway(pen,g, x0+pw*0.20, gy, pw*0.14, h*1.02);
    fig(pen,g, x0+pw*0.42, gy, h, tone, 1, "stoop", lw);                      // the stranger, over the sill
    fig(pen,g, x0+pw*0.78, gy, h*0.96, near, -1, "stand", lw*0.95);           // a suitor watching him come
  } else if (reg.key==="contest"){
    const J = fig(pen,g, x0+pw*0.15, gy, h, tone, 1, "brace", lw);            // braced on the bow
    const gapY = J.wrA.y;
    const ax0=x0+pw*0.42, ax1=x0+pw*0.88, n=params.axes, pitch=(ax1-ax0)/(n-1);
    drawAxes(pen,g, ax0, ax1, gy, h*0.86, gapY, n);
    // the bow: a tall open D ahead of the grip, string drawn back to the cheek
    const r=h*0.40, bcx=J.wrA.x-r*0.14, a=1.30;
    pen.ink(()=>{ g.arc(bcx, J.wrA.y, r, -a, a); }, Math.max(3.5,lw*0.52));
    const tp={x:bcx+r*Math.cos(-a), y:J.wrA.y+r*Math.sin(-a)};
    const bt={x:bcx+r*Math.cos(a),  y:J.wrA.y+r*Math.sin(a)};
    pen.ink(()=>{ g.moveTo(tp.x,tp.y); g.lineTo(J.wrB.x,J.wrB.y); g.lineTo(bt.x,bt.y); }, Math.max(2.2,lw*0.30));
    // the flight: one dash per gap it has already passed, not a bar across the cell
    const lwF=Math.max(3.0,lw*0.42);
    pen.ink(()=>{ g.moveTo(J.wrB.x, gapY); g.lineTo(ax0-pitch*0.42, gapY); }, lwF);
    for(let i=0;i<n-1;i++){ const sx=ax0+i*pitch+pitch*0.24, ex=ax0+(i+1)*pitch-pitch*0.24;
      pen.ink(()=>{ g.moveTo(sx, gapY); g.lineTo(ex, gapY); }, lwF); }
    const tipX = ax1+pitch*1.5;
    pen.ink(()=>{ g.moveTo(ax1+pitch*0.24, gapY); g.lineTo(tipX-pw*0.014, gapY); }, lwF);
    pen.paint(()=>{ g.moveTo(tipX+pw*0.016, gapY); g.lineTo(tipX-pw*0.014, gapY-h*0.042);
      g.lineTo(tipX-pw*0.014, gapY+h*0.042); g.closePath(); }, toneSolid(inkLevel(7)), 2.4);
  } else {  // recognition — the sign no stranger could know
    drawBed(pen,g, x0+pw*0.26, gy, pw*0.32, h*0.62);
    fig(pen,g, x0+pw*0.62, gy, h, tone, 1, "embrace", lw);                    // Odysseus
    fig(pen,g, x0+pw*0.62+h*0.56, gy, h*0.92, near, -1, "embrace", lw*0.95);  // Penelope
  }
  g.restore();

  // cell frame — solid + bold while the testimony is dwelling here
  const active = glow > 0.85;
  g.strokeStyle=INK; g.lineWidth = active?3.5:2; g.lineCap="butt";
  if (!active){ g.globalAlpha=0.55; g.setLineDash([H*0.012, H*0.009]); }
  g.strokeRect(x0, ry0, pw, rh);
  g.setLineDash([]); g.globalAlpha=1;
}

/* ---- the gutter thread: the order of the telling, numbered in bars (I..IIII),
   a dwell dot on the cell being told, and a solid terminus — the consequence,
   the story closing into song. ---- */
function drawThread(pen,g,W,H,glow){
  const gx=W*0.092;
  const yTop=H*params.regs[0].y0, yEnd=H*params.regs[3].y1 - H*0.030;
  g.strokeStyle=INK; g.lineWidth=2.5; g.globalAlpha=0.7; g.setLineDash([H*0.018,H*0.012]);
  g.beginPath(); g.moveTo(gx,yTop); g.lineTo(gx,yEnd); g.stroke();
  g.setLineDash([]); g.globalAlpha=1;
  params.regs.forEach((reg,i)=>{
    const cy=H*(reg.y0+reg.y1)/2;
    if (i<3){ const ay=H*reg.y1; g.strokeStyle=INK; g.lineWidth=3; g.beginPath();
      g.moveTo(gx-W*0.014, ay-H*0.008); g.lineTo(gx, ay+H*0.005); g.lineTo(gx+W*0.014, ay-H*0.008); g.stroke(); }
    const n=i+1; g.strokeStyle=INK; g.lineWidth=Math.max(3, W*0.0062); g.lineCap="round";
    for(let k=0;k<n;k++){ const tx=gx-(n-1)*W*0.011 + k*W*0.022;
      g.beginPath(); g.moveTo(tx, cy-H*0.019); g.lineTo(tx, cy+H*0.019); g.stroke(); }
    if (glow[i] > 0.85){ g.fillStyle=INK; g.beginPath(); g.arc(gx, cy+H*0.042, W*0.011, 0, TAU); g.fill(); }
  });
  // terminus: the testimony fixed — a solid diamond the thread runs into
  const dy=yEnd+H*0.018, r=W*0.020;
  g.fillStyle=INK; g.beginPath();
  g.moveTo(gx, dy-r); g.lineTo(gx+r, dy); g.lineTo(gx, dy+r); g.lineTo(gx-r, dy);
  g.closePath(); g.fill();
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t || 0;

  // glow per cell: the caller may pass an explicit array; otherwise sweep over t
  let glow = st.glow;
  if (!Array.isArray(glow)){
    const ph = frac(t/params.period);
    const active = Math.min(3, Math.floor(ph*4));
    glow = [0,1,2,3].map(i => i===active ? 1 : params.ghost);
  }

  const layers = st.layers || ["thread","loom","beggar","contest","recognition"];
  const has = l => layers.includes(l);

  params.regs.forEach((reg,i)=>{ if (has(reg.key)) drawRegister(pen,g,W,H,reg,i,glow[i]); });
  if (has("thread")) drawThread(pen,g,W,H,glow);
  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.penelope-memory-tableau",
  type:"DIVINE_FX",
  name:"Penelope memory tableau",
  statusWord:"TESTIFIED",
  scene:"OD-B24-S02",

  params,
  // back -> front; a scene may pass a subset to reveal the cells one at a time
  layers:["thread","loom","beggar","contest","recognition"],
  // normalized 0..1 anchors: the four cells, the actors, the props, the thread
  anchors:{
    "cell:loom":{x:.56,y:.184},
    "cell:beggar":{x:.56,y:.399},
    "cell:contest":{x:.56,y:.614},
    "cell:recognition":{x:.56,y:.829},
    "actor:penelope-weaving":{x:.48,y:.26},
    "prop:loom":{x:.68,y:.22},
    "actor:beggar-arriving":{x:.50,y:.48},
    "actor:suitor-watching":{x:.78,y:.48},
    "door:megaron":{x:.33,y:.44},
    "actor:odysseus-braced":{x:.29,y:.69},
    "prop:axe-line":{x:.70,y:.68},
    "actor:odysseus-embrace":{x:.68,y:.91},
    "actor:penelope-embrace":{x:.76,y:.91},
    "prop:olive-bed":{x:.39,y:.90},
    "thread:testimony":{x:.09,y:.50},
    "mark:song":{x:.09,y:.95},
    "camera:wide":{x:.50,y:.50},
  },
  // affected regions (per memory-cell) for scene placement / staged reveal
  zones:{
    loom:{ x0:.165,y0:.082,x1:.95,y1:.285 },
    beggar:{ x0:.165,y0:.297,x1:.95,y1:.500 },
    contest:{ x0:.165,y0:.512,x1:.95,y1:.715 },
    recognition:{ x0:.165,y0:.727,x1:.95,y1:.930 },
  },
  // who casts it, on whom, over what field, and what it leaves behind
  effect:{
    source:params.source, target:params.target, field:params.field,
    consequence:"Penelope's arete fixed as song; Agamemnon's verdict on the two wives",
  },

  // DIVINE_FX state machine: which stretch of the testimony the telling dwells in
  states:{
    initial:"tableau",
    nodes:{
      // all four cells present at once — the whole plot, told (neutral)
      tableau:{ preview:{ glow:[0.70,0.58,0.58,0.70], status:"TESTIFIED", progress:.5 } },
      loom:{ preview:{ t:0.8, status:"DELAYED", progress:.15 } },
      beggar:{ preview:{ t:2.8, status:"ADMITTED", progress:.40 } },
      contest:{ preview:{ t:4.8, status:"STRUNG", progress:.68 } },
      recognition:{ preview:{ t:7.2, status:"KNOWN", progress:.95 } },
    },
    edges:[["tableau","loom"],["loom","beggar"],["beggar","contest"],
           ["contest","recognition"],["recognition","tableau"],["tableau","recognition"]],
  },
  duration:8.0,
  channels:["t","glow","reveal","emphasis"],

  preview:()=>({ t:0.8, status:"TESTIFIED", progress:.5,
                 layers:["thread","loom","beggar","contest","recognition"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
