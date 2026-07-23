/* ensemble.odysseuss-expedition — Odysseus's men trapped in the Cyclops' cave.
   ENSEMBLE asset. Scene function (OD-B09-S06): the expedition pressed together
   into a lightless CORNER of Polyphemus's cave, a knot of unarmed sailors
   cowering in the dark — until the Cyclops kindles his hearth and the NEW
   FIRELIGHT sweeps across the rock and EXPOSES THEM ALL TOGETHER. Built from
   ONE separable member template (drawCowerer) instanced N times deterministically
   into the corner. Exposes formation (huddle-in-dark | exposed), density,
   the `light` reveal channel (how far the firelight has reached the huddle),
   and a `fear` reaction-wave (cowering -> recoil/gasp as the light lands).
   Each member's tone is driven by how much firelight falls on it, so at
   light=0 the men are near-invisible dark shapes fused with the corner, and at
   light=1 the front of the huddle is legible and afraid while the deep corner
   still holds shadow. Drawn in SOLID grays + hard contour; the engine dotify
   pass supplies the halftone. Do NOT bake named characters in. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

const params = {
  formation:"exposed",     // huddle-in-dark | exposed
  rows:3,                  // depth tiers (back/deep-corner .. front/nearer-fire)
  perRow:[4,3,2],          // members per tier (density) — a crammed knot
  fireDir:1,               // +1 fire/hearth on the right .. -1 on the left
  light:0.85,              // firelight reveal: how far the glow has reached (0..1)
  fear:0.8,                // reaction-wave: dread across the huddle (0..1)
  showFire:true,           // draw the Cyclops' new hearth-fire + thrown glow
  floorLevel:0.905,        // cave floor as fraction of H
};

/* ============================================================
   ONE member template — an unarmed sailor cowering in the corner.
   All geometry keyed off `s` (member scale). Pose driven by scalars packed on
   the member: `reveal` (0 hidden in dark .. 1 in full firelight), `fear`
   (0 slack .. 1 recoiling), `shield` (forearm flung up against the glare),
   `duck` (head pulled down into the shoulders). `fd` = fire direction (the lit
   side). Tone is set by `reveal` so unlit men sink into the corner dark and lit
   men become legible; a thin bright RIM on the fire side sells the reveal.
   ============================================================ */
function drawCowerer(pen, m){
  const g = pen.ctx, s = m.s, fd = m.fd, rv = m.reveal;
  // tone: dark silhouette (level ~6) when unlit -> legible (level ~2 skin) when lit
  const skinL  = Math.round(lerp(6, 2, rv));
  const tunL   = Math.round(lerp(6, 4, rv));
  const hairL  = Math.min(7, tunL+1);
  const skin   = toneSolid(inkLevel(skinL));
  const tunic  = toneSolid(inkLevel(tunL));
  const legT   = toneSolid(inkLevel(Math.min(7, tunL+1)));
  const hair   = toneSolid(inkLevel(hairL));
  const rim     = inkLevel(Math.max(0, skinL-4));   // bright edge on the fire side
  const cw     = Math.max(2, s*0.02);

  const footY   = m.baseY;
  const cx      = m.cx;
  const hipY    = footY - s*0.19;                    // low hips — sitting/cowering
  const kneeApexX = cx + fd*s*0.14;                  // knees drawn up toward the light
  const kneeApexY = footY - s*0.34;
  const torsoLen = s*0.23;
  const lean    = -fd*s*(0.04 + 0.06*m.fear);        // body recoils AWAY from the fire
  const shoCx   = cx + lean;
  const shoY    = hipY - torsoLen;
  const shoHalf = s*0.16;
  const headR   = s*0.105*m.headS;
  const headCx  = shoCx + fd*headR*0.35*rv - fd*0*0 ; // lit men turn toward the fire
  const headCy  = shoY - headR*1.05 + m.duck*headR*0.7;

  // ---- ground shadow (a pooled dark under the cowering mass) ----
  g.fillStyle = "rgba(0,0,0,0.14)";
  g.beginPath(); g.ellipse(cx, footY+s*0.01, s*0.24, s*0.045, 0,0,7); g.fill();

  // ---- TUCKED LEGS : thighs up to the knees, shins folded back to the feet ----
  {
    const thighW = Math.max(3, s*0.11), shinW = Math.max(3, s*0.075);
    for (const side of [-1,1]){
      const hp = { x:cx+side*s*0.10, y:hipY };
      const kp = { x:kneeApexX+side*s*0.055, y:kneeApexY+Math.abs(side)*0 };
      const fp = { x:cx+fd*s*0.02+side*s*0.075, y:footY };
      pen.limb(()=>{ g.moveTo(hp.x,hp.y); g.lineTo(kp.x,kp.y); }, tunic, thighW);
      pen.limb(()=>{ g.moveTo(kp.x,kp.y); g.lineTo(fp.x,fp.y); }, legT, shinW);
      pen.paint(()=>{ g.ellipse(fp.x+fd*s*0.02, fp.y, s*0.06, s*0.028, 0,0,7); }, toneSolid(inkLevel(Math.min(7,tunL+2))), cw*0.6);
    }
  }

  // ---- FAR ARM (behind torso) : wrapped around the drawn-up knees, clutching ----
  {
    const sh = { x:shoCx - fd*shoHalf*0.85, y:shoY+s*0.04 };
    const wr = { x:kneeApexX - fd*s*0.02, y:kneeApexY+s*0.02 };
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(cx-fd*s*0.02, kneeApexY+s*0.05); g.lineTo(wr.x,wr.y); }, tunic, Math.max(3,s*0.062));
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.032,0,7); }, skin, cw*0.6);
  }

  // ---- TORSO : hunched trapezoid, shoulders pulled up around a bowed neck ----
  pen.paint(()=>{
    g.moveTo(cx-s*0.11, hipY);
    g.lineTo(cx+s*0.11, hipY);
    g.lineTo(shoCx+shoHalf, shoY);
    g.lineTo(shoCx-shoHalf, shoY);
    g.closePath();
  }, tunic, cw);
  // a fold seam + belt so the ragged tunic reads
  pen.seam(()=>{ g.moveTo(cx-s*0.10, hipY-s*0.01); g.lineTo(cx+s*0.10, hipY-s*0.01); }, cw*0.7);
  pen.seam(()=>{ g.moveTo(shoCx+lean*0.2, shoY+s*0.05); g.lineTo(cx-fd*s*0.01, hipY-s*0.02); }, cw*0.55);
  // bright RIM down the fire-side edge of the torso (the firelight catching the shoulder)
  if (rv > 0.35){
    g.strokeStyle=rim; g.lineWidth=Math.max(2,s*0.02); g.globalAlpha=clamp01((rv-0.3)*1.3); g.lineCap="round";
    g.beginPath(); g.moveTo(shoCx+fd*shoHalf, shoY+s*0.01); g.lineTo(cx+fd*s*0.11, hipY); g.stroke();
    g.globalAlpha=1;
  }

  // ---- NECK + HEAD ----
  pen.limb(()=>{ g.moveTo(shoCx+fd*s*0.01, shoY+s*0.01); g.lineTo(headCx, headCy+headR*0.8); }, skin, s*0.048);
  // hair back-mass (nape), drawn before the face
  pen.paint(()=>{ g.arc(headCx, headCy+headR*0.02, headR*1.02, Math.PI*0.92, Math.PI*2.08); }, hair, cw*0.7);
  pen.paint(()=>{ g.ellipse(headCx, headCy, headR*0.94, headR, 0,0,7); }, skin, cw*0.8);

  // beard on the veterans
  if (m.feat.beard)
    pen.paint(()=>{
      g.moveTo(headCx-headR*0.55, headCy+headR*0.30);
      g.quadraticCurveTo(headCx, headCy+headR*1.30, headCx+headR*0.55, headCy+headR*0.30);
      g.quadraticCurveTo(headCx, headCy+headR*0.62, headCx-headR*0.55, headCy+headR*0.30);
    }, toneSolid(inkLevel(Math.min(7,hairL))), cw*0.6);

  // ---- FACE : only legible once the firelight lands (rv), and then AFRAID ----
  if (rv > 0.28){
    const eyeY = headCy - headR*0.05;
    const eyeDX = headR*0.34;
    const gx = fd*headR*0.16*rv;                          // eyes cut toward the fire
    const eyeR = headR*(0.11 + 0.09*m.fear);              // fear widens the eyes
    g.fillStyle=INK;
    g.beginPath(); g.ellipse(headCx-eyeDX+gx, eyeY, eyeR, eyeR*1.15, 0,0,7); g.fill();
    g.beginPath(); g.ellipse(headCx+eyeDX+gx, eyeY, eyeR, eyeR*1.15, 0,0,7); g.fill();
    // a fearful raised brow
    g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.12); g.lineCap="round";
    g.beginPath(); g.moveTo(headCx-eyeDX-headR*0.18, eyeY-headR*0.30); g.lineTo(headCx-eyeDX+headR*0.14, eyeY-headR*0.44); g.stroke();
    g.beginPath(); g.moveTo(headCx+eyeDX-headR*0.14, eyeY-headR*0.44); g.lineTo(headCx+eyeDX+headR*0.18, eyeY-headR*0.30); g.stroke();
    // open, gasping mouth (dread) — a dark oval that grows with fear
    g.fillStyle=INK; g.beginPath();
    g.ellipse(headCx+gx*0.6, headCy+headR*0.5, headR*0.17, headR*(0.10+0.20*m.fear), 0,0,7); g.fill();
  }

  // ---- NEAR ARM : a forearm flung UP against the sudden glare (the reveal) ----
  {
    const shN = { x:shoCx + fd*shoHalf*0.9, y:shoY+s*0.03 };
    const raise = m.shield;                                // 0 slack .. 1 arm across the face
    const elb = { x:shN.x + fd*s*0.10, y:shoY - s*0.02*raise };
    const wr  = { x:headCx + fd*headR*(1.1 - 0.2*raise), y:lerp(hipY - s*0.04, headCy - headR*0.4, raise) };
    pen.limb(()=>{ g.moveTo(shN.x,shN.y); g.lineTo(elb.x,elb.y); g.lineTo(wr.x,wr.y); }, tunic, Math.max(3,s*0.06));
    pen.paint(()=>{ g.ellipse(wr.x,wr.y,s*0.036,s*0.028,fd*0.5,0,7); }, skin, cw*0.6);   // splayed hand
  }
}

/* ============================================================
   THE CAVE CORNER — two rough rock walls meeting in deep shadow, a stony floor,
   and (once kindled) the Cyclops' hearth throwing a wedge of firelight across
   the huddle. The deep corner stays dark for contrast; the thrown-light pool
   lightens the floor + lower wall in front of the men.
   ============================================================ */
function jaggedTop(g, W, H, seed){
  const rng = rnd(seed);
  g.moveTo(0,0); g.lineTo(W,0);
  g.lineTo(W, H*0.10);
  for(let x=W; x>=0; x-=W*0.09){
    const y = H*(0.09 + rng()*0.06);
    g.lineTo(x, y);
    g.lineTo(x - W*0.045, y - H*0.03 - rng()*H*0.02);   // stalactite jag
  }
  g.lineTo(0, H*0.11); g.closePath();
}

function drawCave(pen, W, H, st){
  const g = pen.ctx;
  const floorY = (st.floorLevel ?? params.floorLevel) * H;
  const fd = st.fireDir ?? params.fireDir;
  const light = clamp01(st.light ?? params.light);
  const showFire = st.showFire ?? params.showFire;

  // fire/hearth position (on the fd side, low)
  const fx = (fd>0 ? 0.82 : 0.18) * W;
  const fy = floorY - H*0.03;
  // the corner (opposite the fire) — where the men are pressed
  const cornerX = (fd>0 ? 0.08 : 0.92) * W;

  // ---- base rock: fill the whole frame mid-dark (a closed cave) ----
  g.fillStyle = inkLevel(4); g.fillRect(0,0,W,H);

  // ---- ceiling / back rock mass with hanging jags (darker, low-slung so the
  //      cave feels closed and heavy, not an open bright void) ----
  pen.paint(()=>{ jaggedTop(g,W,H,7); }, toneSolid(inkLevel(5)), Math.max(3,W*0.006));
  // a heavier upper back-wall band under the jags so the top reads as rock, not sky
  pen.paint(()=>{ g.rect(0, H*0.11, W, H*0.16); }, toneSolid(inkLevel(5)), 3);
  // a darker back-wall wash over the upper-mid so the interior reads as enclosing
  // rock (not open void), lightening toward the middle
  g.fillStyle=inkLevel(4); g.fillRect(0,H*0.11,W,H*0.30);
  g.strokeStyle=INK; g.globalAlpha=0.22; g.lineWidth=2;   // strata lines
  for(let k=0;k<5;k++){ const y=H*(0.30+k*0.055); g.beginPath();
    for(let x=0;x<=W;x+=W*0.06){ const yy=y+Math.sin(x*0.02+k)*4; x===0?g.moveTo(x,yy):g.lineTo(x,yy);} g.stroke(); }
  g.globalAlpha=1;
  // stalactites hanging from the ceiling into the cave (deterministic)
  {
    const sr = rnd(19);
    for(let i=0;i<6;i++){
      const sx = lerp(W*0.14, W*0.92, (i+sr()*0.6)/6);
      const sh = H*(0.06+sr()*0.09), sw = W*(0.018+sr()*0.016);
      pen.paint(()=>{ g.moveTo(sx-sw, H*0.11); g.lineTo(sx+sw, H*0.11); g.lineTo(sx, H*0.11+sh); g.closePath(); },
                toneSolid(inkLevel(5)), Math.max(2,W*0.004));
    }
  }

  // ---- side rock wall on the corner side (rough vertical face) ----
  pen.paint(()=>{
    const wx = fd>0 ? 0 : W;
    g.moveTo(wx, 0);
    g.lineTo(wx + fd*W*0.16, H*0.05);
    for(let y=H*0.05; y<=floorY; y+=H*0.11){
      g.lineTo(wx + fd*W*(0.13+0.05*Math.sin(y*0.02)), y);
    }
    g.lineTo(wx + fd*W*0.11, floorY);
    g.lineTo(wx, floorY);
    g.closePath();
  }, toneSolid(inkLevel(6)), Math.max(3,W*0.006));

  // ---- the DEEP-DARK CORNER shadow, hugging the floor behind the huddle (the
  //      lightless press). A low blob anchored bottom-corner, not a floating slab. ----
  pen.paint(()=>{
    g.moveTo(cornerX - fd*W*0.03, floorY);
    g.lineTo(cornerX + fd*W*0.02, H*0.52);
    g.quadraticCurveTo(cornerX + fd*W*0.22, H*0.55, cornerX + fd*W*0.40, H*0.70);
    g.quadraticCurveTo(cornerX + fd*W*0.44, floorY-H*0.02, cornerX + fd*W*0.30, floorY);
    g.closePath();
  }, toneSolid(inkLevel(7)), Math.max(3,W*0.006));

  // ---- stony FLOOR band (mid) ----
  g.fillStyle=inkLevel(4); g.fillRect(0,floorY,W,H-floorY);
  pen.ink(()=>{ g.moveTo(0,floorY); g.lineTo(W,floorY); }, Math.max(3,W*0.005));
  // a few floor cracks
  g.strokeStyle=INK; g.globalAlpha=0.30; g.lineWidth=2;
  for(let i=1;i<5;i++){ const x=lerp(W*0.1,W*0.9,i/5); g.beginPath(); g.moveTo(x,floorY); g.lineTo(x+(fd)*W*0.03,H); g.stroke(); }
  g.globalAlpha=1;

  // ---- THROWN FIRELIGHT : a lighter wedge fanning from the hearth across the
  //      huddle floor + lower wall. Its brightness scales with `light`. Drawn
  //      over the floor/wall but BEFORE the men, so it reveals them from behind. ----
  if (light > 0.02){
    const poolL = Math.round(lerp(4, 1, light));         // 4 (dim) .. 1 (bright)
    g.save();
    g.globalAlpha = clamp01(0.35 + light*0.65);
    g.fillStyle = inkLevel(poolL);
    g.beginPath();
    g.moveTo(fx, fy - H*0.06);                            // apex at the flame
    g.lineTo(cornerX + fd*W*0.14, H*0.60);               // reaches back across the huddle tops
    g.lineTo(cornerX + fd*W*0.05, floorY - H*0.005);     // to the corner floor
    g.lineTo(fx + fd*W*0.06, H+2);                        // sweep along the near floor
    g.closePath(); g.fill();
    g.restore();
  }

  // ---- THE HEARTH-FIRE itself (the new light source) ----
  if (showFire){
    // ember bed
    pen.paint(()=>{ g.ellipse(fx, fy+H*0.01, W*0.075, H*0.02, 0,0,7); }, toneSolid(inkLevel(6)), Math.max(3,W*0.005));
    // stacked stones ringing the hearth
    g.fillStyle=inkLevel(6);
    for(let i=-2;i<=2;i++){ g.beginPath(); g.ellipse(fx+i*W*0.03, fy+H*0.018, W*0.016, H*0.011, 0,0,7); g.fill();
                            g.strokeStyle=INK; g.lineWidth=2; g.stroke(); }
    // flame tongues (light shapes rising) — leave them PALE so they read as light
    const flame = (h,w,l)=>{ pen.paint(()=>{
      g.moveTo(fx-w, fy);
      g.quadraticCurveTo(fx-w*0.4, fy-h*0.5, fx, fy-h);
      g.quadraticCurveTo(fx+w*0.4, fy-h*0.5, fx+w, fy);
      g.quadraticCurveTo(fx, fy+h*0.06, fx-w, fy);
    }, toneSolid(inkLevel(l)), Math.max(2,W*0.005)); };
    flame(H*0.17, W*0.075, 2);
    flame(H*0.115, W*0.045, 1);
    flame(H*0.065, W*0.022, 0);
    // one blue spark — the single accent mark echoed inside the art
    g.fillStyle=ACCENT; g.beginPath(); g.arc(fx+W*0.012, fy-H*0.12, Math.max(2,W*0.007),0,7); g.fill();
  }
}

/* ============================================================
   build the member set deterministically. The huddle packs into the corner in
   depth tiers; each man's tone/pose is set by the firelight reaching him
   (right/front = more lit, deep corner = darker) and the shared `fear`.
   ============================================================ */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const rows = Math.max(1, p.rows|0);
  const perRow = p.perRow || [4,3,2];
  const fd = p.fireDir ?? 1;
  const light = clamp01(p.light);
  const fear = clamp01(p.fear);
  const exposed = (p.formation||"exposed") === "exposed";

  // footline + scale per tier (back/deep-corner .. front/nearer-fire)
  const ROW_Y = [0.64, 0.77, 0.895];
  const ROW_S = [150, 188, 224];
  // the huddle hugs the corner; exposed lets it fan a little wider off the wall
  const packW = exposed ? 0.36 : 0.28;
  const cornerFrac = fd>0 ? 0.15 : 0.85;               // corner-side x for the near edge

  const members = [];
  let gi = 0;
  for (let r=0;r<rows;r++){
    const depth = rows>1 ? r/(rows-1) : 0;              // 0=deep/back .. 1=front
    const front = depth;                                // alias
    const n = perRow[Math.min(r, perRow.length-1)] || 2;
    const rowY = ROW_Y[Math.min(r,ROW_Y.length-1)] * H;
    const s = ROW_S[Math.min(r,ROW_S.length-1)];
    // tier center creeps a touch toward the fire as it comes forward (kept in-corner)
    const cFrac = cornerFrac + fd*(0.05 + 0.07*front);
    const x0 = cFrac - fd*packW*0.15, x1 = cFrac + fd*packW;
    for (let i=0;i<n;i++){
      const t = n>1 ? i/(n-1) : 0.5;
      const px = lerp(x0, x1, t);
      const rng = rnd((r*151+i*37+5)>>>0);
      const feat = { beard: rng()<0.55, headS: 0.92+rng()*0.18 };

      // how much firelight reaches this man: toward the fire (px) + forward = brighter
      const towardFire = fd>0 ? px : (1-px);            // 0 corner .. 1 at the fire
      const reveal = clamp01( light * (0.20 + towardFire*0.95 + front*0.30) );
      // fear: everyone dreads, but the men the light just found recoil hardest
      const lf = clamp01( fear * (0.55 + 0.45*reveal) );
      // shield arm flung up where the glare lands; deep-dark men just duck
      const shield = smooth(clamp01(reveal*1.2 - 0.15)) * (0.4+0.6*fear);
      const duck   = clamp01((1-reveal)*0.6 + 0.2) * (0.4+0.6*fear);

      // packing jitter (tight, deterministic) — bodies crammed together
      let cx = W*px + (rng()-0.5)*s*0.10;
      let by = rowY + (rng()-0.5)*s*0.03;
      cx = clamp(cx, W*0.10, W*0.90);

      members.push({
        cx, baseY:by, s, depth, px, fd,
        reveal, fear:lf, shield, duck,
        feat, headS:feat.headS,
      });
      gi++;
    }
  }
  // back tier -> front tier (painter's order)
  return { members, fd, light, fear };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  drawCave(pen, W, H, st);
  const B = buildMembers(W, H, st);
  B.members.forEach(m => drawCowerer(pen, m));
}

export const asset = {
  id:"ensemble.odysseuss-expedition",
  type:"ENSEMBLE",
  name:"Odysseus's expedition",
  statusWord:"CORNERED",
  scene:"OD-B09-S06",

  params,
  // ONE member template (drawCowerer) instanced into the corner
  member:{ template:"cowerer", modes:["hidden","revealed"] },
  // back -> front draw order the ensemble honors
  layers:["rock","ceiling","side-wall","corner-dark","floor","firelight-pool","hearth","back-tier","mid-tier","front-tier"],
  // normalized 0..1 anchors: the corner, the hearth, the reach of the light
  anchors:{
    "corner:dark":{x:.16,y:.62}, "hearth:fire":{x:.80,y:.86},
    "tier:back":{x:.26,y:.64}, "tier:mid":{x:.34,y:.76}, "tier:front":{x:.42,y:.88},
    "light:edge":{x:.55,y:.72}, "huddle:center":{x:.34,y:.74},
    "entrance:mouth":{x:.90,y:.80}, "camera:wide":{x:.50,y:.55},
  },
  // the corner volume the huddle presses into (for scene placement/pathing)
  zones:{ corner:{ x0:.08,y0:.55,x1:.58,y1:.92 }, hearth:{ x0:.70,y0:.80,x1:.92,y1:.92 } },
  states:{
    initial:"huddle-in-dark",
    nodes:{
      // pressed together into the lightless corner — near-invisible, still
      "huddle-in-dark":{ preview:{ formation:"huddle-in-dark", light:0.06, fear:0.5, status:"HIDDEN" } },
      // the hearth kindles — a first wash of light finds the front of the knot
      "kindling":{       preview:{ formation:"huddle-in-dark", light:0.45, fear:0.7, status:"SEEN" } },
      // the firelight lands full — the whole expedition exposed together, afraid
      "exposed":{        preview:{ formation:"exposed",        light:0.9,  fear:0.9, status:"EXPOSED" } },
    },
    edges:[["huddle-in-dark","kindling"],["kindling","exposed"],["exposed","huddle-in-dark"]],
  },
  channels:["light","fear","formation","fireDir","density"],

  // neutral preview = the reveal moment: firelight across the huddle, dread high
  preview:()=>({ formation:"exposed", light:0.85, fear:0.8, fireDir:1,
                 status:"EXPOSED", progress:0.4 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
