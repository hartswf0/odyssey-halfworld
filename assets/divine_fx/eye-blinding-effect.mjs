/* divine_fx.eye-blinding-effect — the burning stake driven into a single GIANT
   EYE. DIVINE_FX asset. Scene function (OD-B09-S09): a localized, violent effect
   at one huge eye — a glowing ember stake meets the eyeball (SOURCE), the eye is
   the TARGET, the surrounding socket/air is the FIELD of burst + steam + blood +
   smoke, and the eye undergoes a permanent TRANSFORM from glaring/intact to a
   ruined, blinded socket.

   Procedural, in the DIVINE_FX contract and animated over state.t:
     SOURCE   — the burning olive stake + its ember tip, descending to the eye
     TARGET   — the giant eye (sclera / iris / pupil), which is punctured
     FIELD    — radial impact burst, steam jets, running blood, rising smoke
     TRANSFORM— blind = smooth(t): eye open+bright -> struck+ember -> shut+dark
   t ~ 0.08 : eye glaring, stake approaching, first ember heat
   t ~ 0.50 : IMPACT — burst spikes, ember core white-hot, steam + first blood
   t ~ 1.00 : permanent BLINDED — lids clenched over a black ruined socket, ember
              cooled to char, blood dried down the cheek, smoke lingering.

   Drawn in SOLID grays + hard black contour (engine primitives ONLY); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);
const ilerp = (a,b,t)=> inkLevel(Math.round(lerp(a,b,clamp01(t))));

const params = {
  eye:{ x:0.50, y:0.46 },   // centre of the giant eye (the TARGET)
  eyeW:0.62,                // full eye width  as fraction of W
  eyeH:0.155,               // eye half-height as fraction of H
  stakeFrom:{ x:0.12, y:0.06 }, // the burning stake enters from here (SOURCE)
  burstSpikes:15,           // radial impact spikes at the wound
  steamJets:4,              // curling steam plumes off the burn
  bloodStreaks:5,           // blood running down the cheek
  intensity:1.0,            // master energy of the effect
};

/* wavy rising plume: one curling stroke from (x0,y0) up by `hgt`, wobbling. */
function plume(g, x0, y0, hgt, wob, t, phase){
  const segs=6;
  g.moveTo(x0, y0);
  for(let i=1;i<=segs;i++){
    const f=i/segs;
    const y=y0-hgt*f;
    const x=x0 + Math.sin(f*3.4 + t*2.2 + phase)*wob*f + (f*f)*wob*0.4;
    const py=y0-hgt*(f-0.5/segs);
    const px=x0 + Math.sin((f-0.5/segs)*3.4 + t*2.2 + phase)*wob*(f) + wob*0.2;
    g.quadraticCurveTo(px, py, x, y);
  }
}

/* ---- FACE FRAMING: brow ridge above + cheek/socket below, so the eye reads as
   a single GIANT eye set in a face (diagrammatic, no baked character). ---- */
function drawFace(pen,g,W,H,cx,cy,ew,eh,blind){
  // brow ridge — heavy arch riding above the upper lid
  const bt=eh*2.6;
  pen.paint(()=>{
    g.moveTo(cx-ew*0.62, cy-eh*0.2);
    g.quadraticCurveTo(cx, cy-eh-bt, cx+ew*0.62, cy-eh*0.2);
    g.quadraticCurveTo(cx+ew*0.60, cy-eh*0.55, cx, cy-eh*0.72);
    g.quadraticCurveTo(cx-ew*0.60, cy-eh*0.55, cx-ew*0.62, cy-eh*0.2);
    g.closePath();
  }, toneSolid(inkLevel(3)), 5);
  // a brow furrow line (deepens as the eye clenches shut)
  pen.ink(()=>{
    g.moveTo(cx-ew*0.30, cy-eh*1.0-bt*0.28);
    g.quadraticCurveTo(cx, cy-eh*1.15-bt*0.42*(1+blind*0.5), cx+ew*0.30, cy-eh*1.0-bt*0.28);
  }, 3);
  // lower cheek / socket bag
  pen.paint(()=>{
    g.moveTo(cx-ew*0.56, cy+eh*0.15);
    g.quadraticCurveTo(cx, cy+eh*2.1, cx+ew*0.56, cy+eh*0.15);
    g.quadraticCurveTo(cx, cy+eh*0.9, cx-ew*0.56, cy+eh*0.15);
    g.closePath();
  }, toneSolid(inkLevel(2)), 4);
}

/* ---- the GIANT EYE (TARGET): almond of sclera, iris, pupil. `blind` closes the
   lids and grows the ruined black wound; `ember`/`heat` glow the puncture. ---- */
function drawEye(pen,g,W,H,cx,cy,ew,eh0,blind,heat,t){
  const open=1-0.62*blind;              // lids clench as the eye is destroyed
  const eh=eh0*open;
  const lidDrop=eh0*0.10*blind;         // upper lid also droops
  // almond outline + sclera
  pen.paint(()=>{
    g.moveTo(cx-ew/2, cy);
    g.quadraticCurveTo(cx, cy-eh+lidDrop, cx+ew/2, cy);
    g.quadraticCurveTo(cx, cy+eh, cx-ew/2, cy);
    g.closePath();
  }, toneSolid(inkLevel(1)), 6);

  // clip to the eye so the iris/pupil/wound can't spill past the lids
  g.save();
  g.beginPath();
  g.moveTo(cx-ew/2, cy);
  g.quadraticCurveTo(cx, cy-eh+lidDrop, cx+ew/2, cy);
  g.quadraticCurveTo(cx, cy+eh, cx-ew/2, cy);
  g.closePath();
  g.clip();

  const irisR=Math.min(ew*0.235, eh0*0.98);
  const iy=cy-lidDrop*0.4;
  // iris (mid tone, darkening as the eye dies)
  pen.paint(()=>{ g.arc(cx, iy, irisR, 0, TAU); }, toneSolid(ilerp(4,6,blind)), 5);
  // iris striations
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.35;
  for(let k=0;k<14;k++){ const a=k/14*TAU; g.beginPath();
    g.moveTo(cx+Math.cos(a)*irisR*0.42, iy+Math.sin(a)*irisR*0.42);
    g.lineTo(cx+Math.cos(a)*irisR*0.94, iy+Math.sin(a)*irisR*0.94); g.stroke(); }
  g.globalAlpha=1;
  // pupil
  pen.paint(()=>{ g.arc(cx, iy, irisR*0.46, 0, TAU); }, toneSolid(inkLevel(7)), 4);

  // ---- the WOUND / ember puncture (grows from the pupil outward) ----
  const woundR=irisR*(0.20+0.95*blind);
  if (blind>0.02){
    // charred outer ring
    pen.paint(()=>{
      const p=9; g.moveTo(cx+woundR*1.32, iy);
      for(let k=1;k<=p;k++){ const a=k/p*TAU; const rr=woundR*(1.15+0.34*((k*53)%7)/7);
        g.lineTo(cx+Math.cos(a)*rr, iy+Math.sin(a)*rr); }
      g.closePath();
    }, toneSolid(inkLevel(6)), 3);
    // ember mid-glow ring (warm falloff) — only while it burns
    if (heat>0.04){
      g.globalAlpha=0.85*heat;
      pen.paint(()=>{ g.arc(cx, iy, woundR*0.92, 0, TAU); }, toneSolid(inkLevel(3)), 0);
      g.globalAlpha=1;
    }
    // core: white-hot while burning -> black char when cold/blinded
    pen.paint(()=>{ g.arc(cx, iy, woundR*0.58, 0, TAU); },
      toneSolid(ilerp(7,1,heat)), 3);
  }
  g.restore();

  // lid contour lines redrawn over the top for a crisp clenched read
  pen.ink(()=>{
    g.moveTo(cx-ew/2, cy);
    g.quadraticCurveTo(cx, cy-eh+lidDrop, cx+ew/2, cy);
  }, 5);
  pen.ink(()=>{
    g.moveTo(cx-ew/2, cy);
    g.quadraticCurveTo(cx, cy+eh, cx+ew/2, cy);
  }, 5);
  // extra clench creases when fully blinded
  if (blind>0.55){
    g.globalAlpha=(blind-0.55)/0.45;
    pen.ink(()=>{ g.moveTo(cx-ew*0.42, cy-eh*0.4); g.quadraticCurveTo(cx, cy-eh*0.1, cx+ew*0.42, cy-eh*0.4); }, 3);
    pen.ink(()=>{ g.moveTo(cx-ew*0.42, cy+eh*0.4); g.quadraticCurveTo(cx, cy+eh*0.1, cx+ew*0.42, cy+eh*0.4); }, 3);
    g.globalAlpha=1;
  }
}

/* ---- the burning STAKE (SOURCE): olive-wood beam driven diagonally into the
   eye, glowing tip. Present through the strike, withdrawn afterward. ---- */
function drawStake(pen,g,W,H,cx,cy,pres,heat){
  if (pres<=0.02) return;
  g.save(); g.globalAlpha=pres;
  const fx=W*params.stakeFrom.x, fy=H*params.stakeFrom.y;
  const tx=cx, ty=cy;                    // tip meets the eye centre
  const dx=tx-fx, dy=ty-fy, len=Math.hypot(dx,dy);
  const ux=dx/len, uy=dy/len, nx=-uy, ny=ux;
  const halfW=W*0.017;
  // shaft
  pen.paint(()=>{
    g.moveTo(fx+nx*halfW, fy+ny*halfW);
    g.lineTo(tx+nx*halfW*0.5, ty+ny*halfW*0.5);
    g.lineTo(tx-nx*halfW*0.5, ty-ny*halfW*0.5);
    g.lineTo(fx-nx*halfW, fy-ny*halfW);
    g.closePath();
  }, toneSolid(inkLevel(6)), 4);
  // wood-grain seams
  g.strokeStyle=INK; g.lineWidth=1.5; g.globalAlpha=pres*0.4;
  for(let s=-1;s<=1;s++){ g.beginPath();
    g.moveTo(fx+nx*halfW*0.4*s, fy+ny*halfW*0.4*s);
    g.lineTo(tx+nx*halfW*0.2*s, ty+ny*halfW*0.2*s); g.stroke(); }
  g.globalAlpha=pres;
  // glowing charred tip (hot band just above the eye)
  const gx=lerp(fx,tx,0.86), gy=lerp(fy,ty,0.86);
  pen.paint(()=>{ g.arc(gx, gy, halfW*1.5, 0, TAU); }, toneSolid(inkLevel(6)), 3);
  if (heat>0.05){ g.globalAlpha=pres*heat;
    pen.paint(()=>{ g.arc(gx, gy, halfW*0.9, 0, TAU); }, toneSolid(inkLevel(1)), 0);
    g.globalAlpha=pres; }
  g.restore();
}

/* ---- radial impact BURST: spikes flung OUT from a ring around the wound (kept
   off the centre so the white-hot ember core stays visible). ---- */
function drawBurst(pen,g,W,H,cx,cy,r0,amt){
  if (amt<=0.02) return;
  const n=params.burstSpikes, base=Math.min(W,H)*0.045;
  g.save(); g.globalAlpha=amt;
  for(let i=0;i<n;i++){
    const a=i/n*TAU + ((i*37)%11)/11*0.5;      // jitter off the axes
    const inr=r0*1.05;
    const L=inr + base*(1.0+1.9*((i*29)%7)/7)*amt;
    const w=base*0.14*(0.6+((i*17)%5)/5);
    const sx=cx+Math.cos(a)*inr, sy=cy+Math.sin(a)*inr;
    const ex=cx+Math.cos(a)*L, ey=cy+Math.sin(a)*L;
    const nx=-Math.sin(a), ny=Math.cos(a);
    pen.paint(()=>{
      g.moveTo(sx+nx*w, sy+ny*w);
      g.lineTo(ex, ey);
      g.lineTo(sx-nx*w, sy-ny*w);
      g.closePath();
    }, toneSolid(inkLevel(6)), 2);
  }
  g.restore();
}

/* ---- STEAM jets: curling light plumes hissing off the boiling burn. ---- */
function drawSteam(pen,g,W,H,cx,cy,amt,t){
  if (amt<=0.02) return;
  const n=params.steamJets;
  g.save(); g.strokeStyle=inkLevel(2); g.lineCap="round";
  for(let i=0;i<n;i++){
    const off=(i-(n-1)/2)*W*0.05;
    g.globalAlpha=(0.6-0.08*i)*amt;
    g.lineWidth=Math.max(2, W*0.014*(1-i*0.12));
    g.beginPath();
    plume(g, cx+off*0.4, cy-H*0.01, H*0.24*amt, W*0.045, t, i*1.7);
    g.stroke();
  }
  g.globalAlpha=1; g.restore();
}

/* ---- BLOOD: dark streaks running down the cheek from the ruined eye. ---- */
function drawBlood(pen,g,W,H,cx,cy,ew,amt){
  if (amt<=0.02) return;
  const n=params.bloodStreaks;
  g.save();
  for(let i=0;i<n;i++){
    const sx=cx + (i-(n-1)/2)*ew*0.16 + ((i*31)%5-2)*W*0.006;
    const run=H*(0.10+0.30*amt)*(0.7+((i*23)%5)/5);
    const w=Math.max(2.5, W*0.011*(0.7+((i*13)%4)/4));
    g.strokeStyle=inkLevel(6); g.lineCap="round"; g.lineWidth=w;
    g.globalAlpha=0.9;
    g.beginPath();
    g.moveTo(sx, cy+H*0.02);
    g.quadraticCurveTo(sx+Math.sin(i)*W*0.02, cy+run*0.6, sx+Math.sin(i*1.7)*W*0.03, cy+run);
    g.stroke();
    // drip bead at the end
    pen.paint(()=>{ g.arc(sx+Math.sin(i*1.7)*W*0.03, cy+run+w*0.5, w*0.8, 0, TAU); }, toneSolid(inkLevel(7)), 2);
  }
  g.globalAlpha=1; g.restore();
}

/* ---- SMOKE: dark curling puffs lifting from the burn, drifting up-left. ---- */
function drawSmoke(pen,g,W,H,cx,cy,amt,t){
  if (amt<=0.02) return;
  g.save();
  const puffs=7;
  for(let i=0;i<puffs;i++){
    const f=i/(puffs-1);
    const rise=H*0.30*amt*f + H*0.02;
    const x=cx - W*0.05*f + Math.sin(f*4+t*1.3)*W*0.04;
    const y=cy - rise;
    const r=(W*0.02 + W*0.05*f)*amt;
    g.globalAlpha=(0.5-0.35*f)*amt;
    pen.paint(()=>{ g.arc(x, y, r, 0, TAU); }, toneSolid(inkLevel(5)), 3);
    pen.paint(()=>{ g.arc(x+r*0.6, y+r*0.2, r*0.7, 0, TAU); }, toneSolid(inkLevel(5)), 2);
  }
  g.globalAlpha=1; g.restore();
}

function drawFX(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const t=clamp01(st.t ?? 0.5);
  const inten=st.intensity ?? params.intensity;
  const layers=st.layers || ["face","stake","eye","ember","burst","steam","blood","smoke"];
  const has=l=>layers.includes(l);

  const cx=W*params.eye.x, cy=H*params.eye.y;
  const ew=W*params.eyeW, eh=H*params.eyeH;

  // kinematics of the strike
  const blind=smooth(clamp01((t-0.28)/0.72));                 // permanent transform
  const heat =Math.max(0, Math.sin(clamp01((t-0.30)/0.62)*Math.PI))*inten; // ember heat, peaks mid
  const burst=clamp01(1-Math.abs(t-0.46)*3.4)*inten;          // sharp impact flash
  const steam=clamp01((t-0.38)/0.28)*clamp01((1.05-t)/0.4)*inten;
  const blood=clamp01((t-0.42)/0.4)*inten;
  const smoke=clamp01((t-0.50)/0.5)*inten;
  const stakePres=clamp01((t-0.0)/0.12)*clamp01((0.66-t)/0.22); // in, then withdrawn

  const woundR=Math.min(ew*0.235, H*params.eyeH*0.98)*(0.20+0.95*blind); // matches drawEye

  if (has("face"))  drawFace(pen,g,W,H,cx,cy,ew,eh,blind);
  if (has("stake")) drawStake(pen,g,W,H,cx,cy,stakePres,heat);
  if (has("eye"))   drawEye(pen,g,W,H,cx,cy,ew,eh,blind,heat,t);
  // burst radiates from the wound ring; steam/blood/smoke are the field
  if (has("burst")) drawBurst(pen,g,W,H,cx,cy,woundR,burst);
  // re-stamp the white-hot ember CORE on top so the burst can't bury it
  if (has("ember") && heat>0.06 && blind>0.02){
    g.save();
    g.globalAlpha=0.9*heat;
    pen.paint(()=>{ g.arc(cx, cy-H*params.eyeH*0.10*blind*0.4, woundR*0.5, 0, TAU); },
      toneSolid(inkLevel(1)), 3);
    g.globalAlpha=heat;
    pen.paint(()=>{ g.arc(cx, cy-H*params.eyeH*0.10*blind*0.4, woundR*0.24, 0, TAU); },
      toneSolid(inkLevel(4)), 2);
    g.restore();
  }
  if (has("steam")) drawSteam(pen,g,W,H,cx,cy,steam,t);
  if (has("blood")) drawBlood(pen,g,W,H,cx,cy,ew,blood);
  if (has("smoke")) drawSmoke(pen,g,W,H,cx,cy,smoke,t);

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.eye-blinding-effect",
  type:"DIVINE_FX",
  name:"Eye-blinding effect",
  statusWord:"STRUCK",
  scene:"OD-B09-S09",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["face","stake","eye","ember","burst","steam","blood","smoke"],
  // normalized 0..1 source / target / field / consequence / camera anchors
  anchors:{
    "source:stake":  { x:0.12, y:0.06 },  // the burning stake enters here (SOURCE)
    "target:eye":    { x:0.50, y:0.46 },  // the giant eye — impact point (TARGET)
    "target:pupil":  { x:0.50, y:0.46 },
    "field:wound":   { x:0.50, y:0.46 },  // centre of burst / ember / steam
    "field:steam":   { x:0.50, y:0.28 },
    "consequence:blood":{ x:0.50, y:0.66 }, // blood down the cheek
    "camera:wide":   { x:0.50, y:0.50 },
  },
  // the localized zones the effect occupies
  zones:{ eye:{ x0:0.19, y0:0.30, x1:0.81, y1:0.62 },
          field:{ x0:0.10, y0:0.05, x1:0.90, y1:0.95 } },
  // DIVINE_FX transform states: intact -> struck -> permanently blinded
  states:{
    initial:"struck",
    nodes:{
      // intact: eye glaring wide, stake descending, first ember heat
      intact:{  preview:{ t:0.08, intensity:1.0, status:"GLARING",  progress:0.08 } },
      // struck: the moment of impact — burst, white-hot ember, steam + blood
      struck:{  preview:{ t:0.50, intensity:1.1, status:"STRUCK",   progress:0.50 } },
      // blinded: permanent — lids clenched over a black ruined socket, smoke
      blinded:{ preview:{ t:1.00, intensity:0.9, status:"BLINDED",  progress:1.00 } },
    },
    edges:[["intact","struck"],["struck","blinded"]],
  },
  duration:4.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity"],

  // neutral preview: the STRIKE — the most legible, dramatic instant. Ember white
  // -hot in the punctured eye, burst spikes flung out, steam hissing, first blood.
  preview:()=>({ t:0.5, intensity:1.1, status:"STRUCK", progress:0.5,
                 layers:["face","stake","eye","ember","burst","steam","blood","smoke"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
