/* ensemble.hidden-greek-warriors — armed men crammed in the horse's dark belly.
   ENSEMBLE asset. Scene function (OD-B04-S04): a compressed knot of Achaean
   warriors packed into a lightless wooden cavity, tense and still, when a
   FAMILIAR VOICE leaks through a seam in the hull (Helen calling their names).
   The wave of TEMPTATION sweeps the ranks — heads lift and turn toward the
   voice, mouths part to answer — and then one man is FORCIBLY STILLED, a hand
   clamped hard over his mouth. Built from ONE separable member template
   (drawWarrior) instanced N times deterministically inside the belly. Exposes
   formation (how tightly packed), density, ATTENTION toward the voice-seam,
   the reaction-wave `strain` (how far the temptation has spread), and the
   `silencedIndex` (which man is being restrained). Drawn in SOLID grays + hard
   contour; the engine dotify pass supplies the halftone. Do NOT bake named
   characters in — the silenced man is any addressable member. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

const params = {
  formation:"packed",   // packed | crouched | pressing
  rows:3,               // depth tiers (back..front)
  perRow:[5,4,3],       // members per tier (density) — tightly crammed
  voiceSide:1,          // +1 voice-seam on the right wall .. -1 on the left
  strain:0.6,           // reaction-wave: how far the temptation has spread
  attention:0.8,        // pull of the voice on the heads (0=none .. 1=full)
  silencedIndex:10,     // roster index of the man clamped/silenced (-1 = none)
  showVoice:true,       // draw the voice-seam of light + call arcs
  showBeam:true,        // draw the low cross-brace they are crammed under
  floorLevel:0.955,     // belly floor as fraction of H
};

/* ============================================================
   ONE member template — a crouched armed warrior in the dark.
   All geometry keyed off `s` (member scale). The reaction pose is driven by
   scalars packed on the member: leanX (toward the voice), headTurn, headUp,
   mouthOpen, plus mode ("still" | "straining" | "silenced"). `feat` carries
   deterministic identity (crest, beard, spear angle, shield) so the packed
   knot reads as individual men.
   ============================================================ */
function drawWarrior(pen, m){
  const g = pen.ctx, s = m.s, vd = m.voiceDir;
  const skin   = toneSolid(inkLevel(m.sh.skin));
  const tunic  = toneSolid(inkLevel(m.sh.tunic));
  const armor  = toneSolid(inkLevel(m.sh.armor));
  const helm   = toneSolid(inkLevel(m.sh.helm));
  const shieldT= toneSolid(inkLevel(m.sh.shield));
  const dark   = toneSolid(inkLevel(7));
  const cw = Math.max(2, s*0.02);

  const footY   = m.baseY;
  const hipHalf = s*0.13, kneeHalf = s*0.175, footHalf = s*0.11;
  const hipY    = footY - s*0.30;                 // low hips — a deep crouch
  const kneeY   = footY - s*0.14;                 // knees up in front
  const torsoLen= s*0.27;
  const shoHalf = s*0.175;
  const cx      = m.cx;
  const lean    = m.leanX;                        // px toward voice at shoulders
  const shoCx   = cx + lean;
  const shoY    = hipY - torsoLen;
  const headR   = s*0.10;
  const headCx  = shoCx + lean*0.30 + m.headTurn*headR*0.55;
  const headCy  = shoY - headR*1.15 - m.headUp*headR*0.45;

  // ---- SPEAR (drawn first, behind) : a shaft rising into the cavity dark ----
  if (m.feat.spear){
    const gripX = cx + vd*s*0.02, gripY = shoY + s*0.03;
    const tipX  = gripX + m.feat.spearLean*s*0.55, tipY = gripY - s*1.02;
    pen.limb(()=>{ g.moveTo(gripX,gripY); g.lineTo(tipX,tipY); }, toneSolid(inkLevel(5)), Math.max(2,s*0.026));
    pen.paint(()=>{ g.ellipse(tipX, tipY-s*0.02, s*0.021, s*0.06, m.feat.spearLean*0.3, 0,7); }, dark, cw*0.7); // leaf blade
  }

  // ---- SHIELD (behind the shoulder, peeking between bodies) ----
  if (m.feat.shield){
    const sx = shoCx - vd*shoHalf*0.85, sy = shoY + s*0.06, sr = s*0.16;
    pen.paint(()=>{ g.arc(sx,sy,sr,0,7); }, shieldT, cw);
    pen.ink(()=>{ g.arc(sx,sy,sr*0.82,0,7); }, cw*0.6);            // inner rim
    pen.paint(()=>{ g.arc(sx,sy,sr*0.24,0,7); }, dark, cw*0.6);   // boss
  }

  // ---- LEGS : deep crouch, knees forward (thigh -> knee -> foot) ----
  const thighW = Math.max(3, s*0.09), shinW = Math.max(3, s*0.07);
  const greave = toneSolid(inkLevel(Math.min(6, m.sh.armor+1)));   // bronze greave, dark
  for (const side of [-1,1]){
    const hp={x:cx+side*hipHalf, y:hipY};
    const kp={x:cx+side*kneeHalf, y:kneeY};
    const fp={x:cx+side*footHalf, y:footY};
    pen.limb(()=>{ g.moveTo(hp.x,hp.y); g.lineTo(kp.x,kp.y); }, tunic, thighW);
    pen.limb(()=>{ g.moveTo(kp.x,kp.y); g.lineTo(fp.x,fp.y); }, greave, shinW);
    pen.paint(()=>{ g.ellipse(fp.x+side*s*0.02, fp.y, s*0.065, s*0.03, 0,0,7); }, toneSolid(inkLevel(7)), cw*0.6);
  }

  // ---- FAR ARM (behind torso) : braced on the knee, tense ----
  {
    const sh={x:shoCx - vd*shoHalf*0.9, y:shoY+s*0.03};
    const wr={x:cx - vd*kneeHalf*0.7, y:kneeY - s*0.02};
    pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(wr.x,wr.y); }, armor, Math.max(3,s*0.06));
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.03,0,7); }, skin, cw*0.6);
  }

  // ---- TORSO : cuirass trapezoid, hunched, sheared toward the voice ----
  pen.paint(()=>{
    g.moveTo(cx-hipHalf, hipY);
    g.lineTo(cx+hipHalf, hipY);
    g.lineTo(shoCx+shoHalf, shoY);
    g.lineTo(shoCx-shoHalf, shoY);
    g.closePath();
  }, armor, cw);
  // cuirass seams (pectoral line + belt) so the armour reads
  pen.seam(()=>{ g.moveTo(shoCx-shoHalf*0.7, shoY+s*0.06); g.quadraticCurveTo(shoCx, shoY+s*0.11, shoCx+shoHalf*0.7, shoY+s*0.06); }, cw*0.7);
  pen.seam(()=>{ g.moveTo(cx-hipHalf, hipY-s*0.02); g.lineTo(cx+hipHalf, hipY-s*0.02); }, cw*0.6);

  // ---- NECK ----
  pen.limb(()=>{ g.moveTo(shoCx, shoY+s*0.01); g.lineTo(headCx, headCy+headR*0.8); }, skin, s*0.05);

  // ---- HEAD ----
  pen.paint(()=>{ g.ellipse(headCx, headCy, headR*0.92, headR, 0,0,7); }, skin, cw*0.8);

  // beard (many of these men are bearded veterans)
  if (m.feat.beard)
    pen.paint(()=>{
      g.moveTo(headCx-headR*0.55, headCy+headR*0.28);
      g.quadraticCurveTo(headCx, headCy+headR*1.35, headCx+headR*0.55, headCy+headR*0.28);
      g.quadraticCurveTo(headCx, headCy+headR*0.62, headCx-headR*0.55, headCy+headR*0.28);
    }, toneSolid(inkLevel(6)), cw*0.7);

  // ---- FACE : eyes under the helmet brow + straining mouth ----
  const eyeY = headCy - headR*0.02, gx = m.headTurn*headR*0.30;
  const eyeR = headR*0.12;
  g.fillStyle = INK;
  if (m.headTurn > -0.7){ g.beginPath(); g.ellipse(headCx+headR*0.32+gx, eyeY, eyeR, eyeR*1.1, 0,0,7); g.fill(); }
  if (m.headTurn <  0.7){ g.beginPath(); g.ellipse(headCx-headR*0.32+gx, eyeY, eyeR, eyeR*1.1, 0,0,7); g.fill(); }
  // open/answering mouth (the temptation to call back) — a dark oval
  if (m.mouthOpen > 0.1){
    g.fillStyle=INK; g.beginPath();
    g.ellipse(headCx+gx, headCy+headR*0.5, headR*0.18, headR*(0.10+0.16*m.mouthOpen), 0,0,7); g.fill();
  }

  // ---- HELMET : Corinthian cap + nasal + crest crescent (drawn over crown) ----
  pen.paint(()=>{
    g.moveTo(headCx-headR*1.06, headCy+headR*0.12);
    g.quadraticCurveTo(headCx-headR*1.12, headCy-headR*1.2, headCx, headCy-headR*1.28);
    g.quadraticCurveTo(headCx+headR*1.12, headCy-headR*1.2, headCx+headR*1.06, headCy+headR*0.12);
    g.quadraticCurveTo(headCx, headCy-headR*0.18, headCx-headR*1.06, headCy+headR*0.12);
  }, helm, cw);
  // nasal guard down the face
  pen.paint(()=>{ g.rect(headCx-headR*0.11+gx, headCy+headR*0.02, headR*0.22, headR*0.72); }, helm, cw*0.5);
  // crest plume, a tall crescent rising forward off the crown (the warrior read)
  pen.paint(()=>{
    g.moveTo(headCx-headR*0.28, headCy-headR*1.26);
    g.quadraticCurveTo(headCx+vd*headR*0.6, headCy-headR*2.55, headCx+vd*headR*1.15, headCy-headR*1.7);
    g.quadraticCurveTo(headCx+vd*headR*0.5, headCy-headR*1.6, headCx+headR*0.05, headCy-headR*1.32);
    g.quadraticCurveTo(headCx-headR*0.15, headCy-headR*1.28, headCx-headR*0.28, headCy-headR*1.26);
  }, toneSolid(inkLevel(m.sh.helm+1>7?7:m.sh.helm+1)), cw*0.8);

  // ---- NEAR ARM : grips the spear, reaches to the voice, or (silenced) pushes ----
  const shN = {x:shoCx + vd*shoHalf*0.9, y:shoY+s*0.03};
  if (m.mode==="straining"){
    // arm flung up toward the voice-seam
    const wr={x:shN.x + vd*s*0.20, y:shoY - s*0.16};
    pen.limb(()=>{ g.moveTo(shN.x,shN.y); g.lineTo(shN.x+vd*s*0.10, shoY-s*0.04); g.lineTo(wr.x,wr.y); }, armor, Math.max(3,s*0.06));
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.032,0,7); }, skin, cw*0.6);   // open hand
  } else {
    // grips the spear shaft near the shoulder
    const gr={x:cx + vd*s*0.03, y:shoY + s*0.04};
    pen.limb(()=>{ g.moveTo(shN.x,shN.y); g.lineTo(gr.x,gr.y); }, armor, Math.max(3,s*0.06));
    pen.paint(()=>{ g.arc(gr.x,gr.y,s*0.03,0,7); }, skin, cw*0.6);
  }

  // ---- THE STILLING : a hand clamped hard over the silenced man's mouth ----
  if (m.mode==="silenced"){
    const mx = headCx + gx, my = headCy + headR*0.5;
    // a forearm crossing in from the restrainer beside him
    pen.limb(()=>{ g.moveTo(mx - vd*s*0.24, my + s*0.05); g.lineTo(mx - vd*headR*0.2, my); }, skin, Math.max(3,s*0.058));
    // the palm over the mouth
    pen.paint(()=>{ g.ellipse(mx, my, headR*0.62, headR*0.46, 0, 0,7); }, skin, cw*0.8);
    pen.seam(()=>{ for(let k=-1;k<=1;k++){ g.moveTo(mx-headR*0.34, my-headR*0.18+k*headR*0.18); g.lineTo(mx+headR*0.44, my-headR*0.18+k*headR*0.18);} }, cw*0.45);
    // a small accent tension mark where impulse meets restraint
    g.fillStyle=ACCENT; g.beginPath(); g.arc(mx+headR*0.5, my-headR*0.1, Math.max(2,s*0.02), 0,7); g.fill();
  }

  return { head:{x:headCx,y:headCy}, r:headR, mode:m.mode, act:m.act };
}

/* ============================================================
   THE BELLY — the dark wooden cavity the men are crammed inside.
   A thick planked hull framing a lighter hollow; a low cross-brace caps the
   crammed space; a voice-seam of light leaks through one wall.
   ============================================================ */
function bellyPath(g, W, H, floorY){
  g.moveTo(W*0.50, H*0.115);
  g.quadraticCurveTo(W*0.14, H*0.15, W*0.115, H*0.42);
  g.quadraticCurveTo(W*0.10, H*0.78, W*0.20, floorY);
  g.lineTo(W*0.80, floorY);
  g.quadraticCurveTo(W*0.90, H*0.78, W*0.885, H*0.42);
  g.quadraticCurveTo(W*0.86, H*0.15, W*0.50, H*0.115);
}

function drawBelly(pen, W, H, st){
  const g = pen.ctx;
  const floorY = (st.floorLevel ?? params.floorLevel) * H;
  const vd = st.voiceSide ?? params.voiceSide;

  // ---- solid dark hull filling the whole frame (the cavity walls) ----
  g.fillStyle = inkLevel(5); g.fillRect(0,0,W,H);
  // planking on the hull walls — sagging horizontal timbers
  g.strokeStyle = inkLevel(7); g.lineWidth = Math.max(2, W*0.006);
  for (let k=0;k<14;k++){
    const y = H*0.06 + k*H*0.066;
    g.beginPath();
    for (let x=0;x<=W;x+=W*0.05){ const yy=y+Math.sin(x*0.012+k)*4; if(x===0) g.moveTo(x,yy); else g.lineTo(x,yy); }
    g.stroke();
  }

  // ---- the hollow interior carved out (LIGHT so the dark packed men read as
  //      strong silhouettes; the cavity's darkness comes from the heavy hull
  //      frame + the dense mass of bodies, not a dark ground) ----
  pen.paint(()=>{ bellyPath(g,W,H,floorY); }, toneSolid(inkLevel(2)), Math.max(4,W*0.008));
  // a modest darker floor band the men crouch on
  g.save();
  g.beginPath(); bellyPath(g,W,H,floorY); g.clip();
  g.fillStyle=inkLevel(3); g.fillRect(0, H*0.84, W, H*0.16);
  // faint back-wall staves inside the hollow
  g.strokeStyle=INK; g.globalAlpha=0.16; g.lineWidth=2;
  for (let i=1;i<9;i++){ const x=lerp(W*0.16,W*0.84,i/9); g.beginPath(); g.moveTo(x,H*0.34); g.lineTo(x,H*0.84); g.stroke(); }
  g.globalAlpha=1;
  g.restore();
  // re-stroke the hollow rim hard
  pen.ink(()=>{ bellyPath(g,W,H,floorY); }, Math.max(4,W*0.008));

  // ---- cross-brace they are crammed under (a heavy timber overhead) ----
  if (st.showBeam ?? params.showBeam){
    pen.paint(()=>{ g.rect(W*0.17, H*0.295, W*0.66, H*0.036); }, toneSolid(inkLevel(6)), Math.max(3,W*0.006));
    pen.seam(()=>{ g.moveTo(W*0.17,H*0.313); g.lineTo(W*0.83,H*0.313); }, 2);
    // two peg joints
    g.fillStyle=inkLevel(7);
    for (const px of [0.31,0.69]){ g.beginPath(); g.arc(W*px, H*0.313, W*0.011, 0,7); g.fill(); }
  }

  // ---- the voice-seam : a familiar voice leaking through the hull ----
  if (st.showVoice ?? params.showVoice){
    const vx = vd>0 ? W*0.882 : W*0.118;
    g.fillStyle=inkLevel(0); g.fillRect(vx-W*0.007, H*0.34, W*0.014, H*0.30);
    g.strokeStyle=INK; g.lineWidth=Math.max(2,W*0.004); g.strokeRect(vx-W*0.007, H*0.34, W*0.014, H*0.30);
    // call arcs radiating inward (the voice naming them)
    g.strokeStyle=ACCENT; g.lineCap="round";
    for (let kk=1;kk<=3;kk++){
      g.globalAlpha=0.55 - kk*0.12; g.lineWidth=Math.max(2,W*0.006);
      g.beginPath();
      g.arc(vx, H*0.49, kk*W*0.055, vd>0?Math.PI*0.66:-Math.PI*0.34, vd>0?Math.PI*1.34:Math.PI*0.34);
      g.stroke();
    }
    g.globalAlpha=1;
  }
}

/* ============================================================
   build the member set deterministically, packing each man's pose from the
   reaction-wave `strain` + attention toward the voice.
   ============================================================ */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const rows = Math.max(1, p.rows|0);
  const perRow = p.perRow || [4,3];
  const vd = p.voiceSide ?? 1;
  const strain = clamp01(p.strain);
  const attention = clamp01(p.attention);
  const silIdx = p.silencedIndex ?? -1;

  const ROW_Y = [0.575, 0.76, 0.94];  // footline fraction per tier (back..front)
  const ROW_S = [165, 200, 238];      // member scale per tier
  const packW = p.formation==="pressing" ? 0.86 : p.formation==="crouched" ? 0.74 : 0.82;

  const members = [];
  let gi = 0;
  for (let r=0;r<rows;r++){
    const depth = rows>1 ? r/(rows-1) : 0;         // 0=back .. 1=front
    const n = perRow[Math.min(r, perRow.length-1)] || 3;
    const rowY = (ROW_Y[Math.min(r,ROW_Y.length-1)]) * H;
    const s = ROW_S[Math.min(r,ROW_S.length-1)];
    const x0 = 0.5 - packW/2, x1 = 0.5 + packW/2;
    for (let i=0;i<n;i++){
      const t = n>1 ? i/(n-1) : 0.5;
      const px = lerp(x0, x1, t);
      const rng = rnd((r*137+i*29+11)>>>0);
      const feat = {
        beard: rng()<0.6, shield: rng()<0.45, spear: rng()<0.9,
        spearLean: (rng()-0.5)*0.5, headS: 0.92+rng()*0.16,
      };
      // proximity to the voice (voice on the vd wall): nearer men tempted first
      const near = vd>0 ? px : (1-px);                 // 0 far .. 1 at the seam
      const a = clamp01(strain*1.35 - (1-near)*0.55 + 0.05);   // local temptation
      const isSil = (gi===silIdx);

      let mode = "still", leanX=0, headTurn=0, headUp=0, mouthOpen=0;
      if (isSil){
        mode="silenced";
        headTurn = vd*0.55; headUp = 0.7; mouthOpen = 0.9;      // straining to answer
        leanX = vd * s * 0.06;                                   // but held — small lean
      } else if (a>0.5){
        mode="straining";
        const e = smooth(a);
        headTurn = vd*(0.35+0.5*e); headUp = 0.35+0.5*e; mouthOpen = 0.4+0.5*e;
        leanX = vd * e * s * 0.11;
      } else {
        mode="still";
        headTurn = vd*0.12*attention; headUp = 0.06; mouthOpen = 0;
        leanX = vd * s * 0.02;
      }

      // packing jitter (tight, deterministic) — bodies crammed together
      let cx = W*px + (rng()-0.5)*s*0.10;
      let by = rowY + (rng()-0.5)*s*0.04;
      cx = clamp(cx, W*0.15, W*0.85);

      members.push({
        cx, baseY:by, s, depth, px, voiceDir:vd,
        mode, leanX, headTurn, headUp, mouthOpen, act:a,
        feat,
        sh:{
          skin:  2,
          tunic: Math.round(lerp(4,3,depth)),
          armor: Math.round(lerp(5,4,depth)),
          helm:  Math.round(lerp(6,5,depth)),
          shield:Math.round(lerp(5,4,depth)),
        },
      });
      gi++;
    }
  }
  return { members, vd, strain, attention };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  drawBelly(pen, W, H, st);
  const B = buildMembers(W, H, st);
  // members already ordered back tier -> front tier (painter's order)
  B.members.forEach(m => drawWarrior(pen, m));
}

export const asset = {
  id:"ensemble.hidden-greek-warriors",
  type:"ENSEMBLE",
  name:"Hidden Greek warriors",
  statusWord:"CRAMMED",
  scene:"OD-B04-S04",

  params,
  // ONE member template (drawWarrior) instanced inside the belly
  member:{ template:"warrior", modes:["still","straining","silenced"] },
  // back -> front draw order the ensemble honors
  layers:["hull","hollow","brace","voice-seam","back-tier","front-tier","stilling"],
  // normalized 0..1 anchors: the voice source, the crammed volume, the stilling
  anchors:{
    "voice:seam":{x:.88,y:.49}, "brace:overhead":{x:.50,y:.27},
    "tier:back":{x:.50,y:.55}, "tier:front":{x:.50,y:.82},
    "silenced:man":{x:.52,y:.72}, "floor:belly":{x:.50,y:.92},
    "center":{x:.50,y:.62}, "camera:wide":{x:.50,y:.50},
  },
  // crammed volume the members pack into (for scene placement/pathing)
  zones:{ belly:{ x0:.14,y0:.30,x1:.86,y1:.95 }, floor:{ x0:.20,y0:.80,x1:.80,y1:.95 } },
  states:{
    initial:"crammed",
    nodes:{
      // packed and still in the dark, spears held, waiting
      crammed:  { preview:{ formation:"packed",   strain:0.05, attention:0.3, silencedIndex:-1, status:"CRAMMED" } },
      // the voice reaches them — heads turn, mouths part to answer
      tempted:  { preview:{ formation:"pressing",  strain:0.85, attention:1.0, silencedIndex:-1, status:"TEMPTED" } },
      // one man is caught and forcibly stilled, a hand over his mouth
      silenced: { preview:{ formation:"pressing",  strain:0.9,  attention:1.0, silencedIndex:10, status:"SILENCED" } },
    },
    edges:[["crammed","tempted"],["tempted","silenced"],["silenced","tempted"],["tempted","crammed"]],
  },
  channels:["strain","attention","voiceSide","silencedIndex","formation","density"],

  // neutral preview = crammed and tense, the voice just beginning to pull them,
  // one man already caught and being stilled
  preview:()=>({ formation:"pressing", strain:0.6, attention:0.8, voiceSide:1,
                 silencedIndex:10, status:"CRAMMED", progress:0.35 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
