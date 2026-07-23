/* divine_fx.athena-to-sea-eagle-transformation — the Mentor form quitting the
   sacrificial gathering as a GREAT SEA-EAGLE crossing overhead. DIVINE_FX asset.
   Scene function (OD-B03-S05): Mentor's human silhouette (Athena in disguise)
   RESOLVES into a broad-winged sea-eagle that lifts off the shore-assembly and
   CROSSES the sky above the gathering, trailing a wake.

   Procedural, in the DIVINE_FX contract: SOURCE (the standing Mentor beside the
   altar) -> FIELD (a crossing corridor / the eagle's wake streaming behind it)
   -> TARGET (the far upper sky) -> TRANSFORM (human -> motes -> great eagle) ->
   visible CONSEQUENCE (the assembly left below, marked by the wake overhead).
   Animates over state.t along a bezier CROSSING ARC: 0 = Mentor still standing,
   ~0.5 = mid-resolve (eagle formed low, lifting, human dissolving into motes),
   1 = the great sea-eagle high and crossing, wings spread, a wake behind it.

   Drawn in SOLID grays + hard black contour (engine primitives only); the
   engine POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth } from "/engine/halfworld-engine.mjs";

const params = {
  departure:{ x:0.26, y:0.82 },   // shore spot the Mentor stands on (source)
  apex:{      x:0.82, y:0.30 },   // far upper sky the eagle crosses to (target)
  ground:0.84,                    // shore / gathering plane as fraction of H
  wakeStreaks:6,                  // streaks trailing behind the crossing eagle
  wingSpan:1.0,                   // master wing extension (channel-driven)
  intensity:1.0,                  // overall energy of the effect
};

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

/* the crossing arc: a single quadratic bezier from the departure spot up and
   across to the far sky. bez() = position, bezTan() = heading (flight angle). */
function ctrlOf(W,H){ return { x:W*0.52, y:H*0.10 }; }   // high control -> arcs over the gathering
function bez(W,H,tt){
  const P0={x:W*params.departure.x, y:H*params.departure.y-H*0.06};
  const C=ctrlOf(W,H);
  const P1={x:W*params.apex.x, y:H*params.apex.y};
  const u=1-tt;
  return { x:u*u*P0.x + 2*u*tt*C.x + tt*tt*P1.x,
           y:u*u*P0.y + 2*u*tt*C.y + tt*tt*P1.y };
}
function bezTan(W,H,tt){
  const P0={x:W*params.departure.x, y:H*params.departure.y-H*0.06};
  const C=ctrlOf(W,H);
  const P1={x:W*params.apex.x, y:H*params.apex.y};
  const dx=2*(1-tt)*(C.x-P0.x)+2*tt*(P1.x-C.x);
  const dy=2*(1-tt)*(C.y-P0.y)+2*tt*(P1.y-C.y);
  return Math.atan2(dy,dx);
}

/* ---- SHORE / SACRIFICIAL GATHERING band the effect crosses ABOVE.
   Diagrammatic only (no baked figures): a ground slab, a central altar with a
   sacrificial flame + rising smoke, and a low row of assembly blocks. ---- */
function drawGathering(pen,g,W,H,t){
  const gy = H*params.ground;
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,gy);           // open sky above (light)
  g.fillStyle = inkLevel(3); g.fillRect(0,gy,W,H-gy);         // shore slab
  pen.ink(()=>{ g.moveTo(0,gy); g.lineTo(W,gy); }, 4);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.32;
  for(let j=1;j<=2;j++){ const y=gy+(H-gy)*(j/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha=1;

  // low row of assembly blocks (the gathering seated along the shore)
  const n=9;
  for(let i=0;i<n;i++){
    const bx=W*(0.10+i*0.80/(n-1));
    if (Math.abs(bx-W*0.5) < W*0.075) continue;              // clear space for the altar
    const bw=W*0.028, bh=H*0.030;
    pen.paint(()=>{ g.rect(bx-bw/2, gy-bh, bw, bh); }, toneSolid(inkLevel(4)), 3);
    pen.paint(()=>{ g.arc(bx, gy-bh-bw*0.5, bw*0.5, 0, TAU); }, toneSolid(inkLevel(4)), 3); // head dab
  }

  // central ALTAR with the sacrificial flame
  const ax=W*0.5, aw=W*0.10, ah=H*0.055;
  pen.paint(()=>{ g.rect(ax-aw/2, gy-ah, aw, ah); }, toneSolid(inkLevel(5)), 4);
  pen.paint(()=>{ g.rect(ax-aw*0.62, gy-ah, aw*1.24, ah*0.22); }, toneSolid(inkLevel(6)), 3); // cap
  // flame
  const fs=W*0.024*(0.9+0.2*Math.sin(t*TAU*1.3));
  pen.paint(()=>{
    g.moveTo(ax, gy-ah-fs*2.4);
    g.quadraticCurveTo(ax+fs*0.9, gy-ah-fs*0.7, ax+fs*0.5, gy-ah);
    g.quadraticCurveTo(ax, gy-ah+fs*0.2, ax-fs*0.5, gy-ah);
    g.quadraticCurveTo(ax-fs*0.9, gy-ah-fs*0.7, ax, gy-ah-fs*2.4);
    g.closePath();
  }, toneSolid(inkLevel(6)), 3);
  // rising smoke plume (light streaks lifting toward the sky the eagle crosses)
  g.save(); g.strokeStyle=inkLevel(2); g.lineCap="round"; g.lineWidth=Math.max(2,W*0.006);
  for(let k=0;k<3;k++){
    const off=(k-1)*W*0.016;
    g.globalAlpha=0.55-k*0.12;
    g.beginPath();
    g.moveTo(ax+off, gy-ah-fs*2.2);
    g.quadraticCurveTo(ax+off+W*0.03*Math.sin(t*2+k), gy-H*0.16,
                       ax+off-W*0.02, gy-H*0.30);
    g.stroke();
  }
  g.globalAlpha=1; g.restore();
}

/* ---- residual MENTOR silhouette (the human disguise she sheds) — stands on the
   shore beside the altar, fades as t rises, sends motes up toward the bird. ---- */
function drawMentor(pen,g,W,H,dx,dy,fade){
  const hH=H*0.22, headR=hH*0.12, headCy=dy-hH+headR, crownY=headCy-headR;
  if (fade<=0.02) return crownY;
  g.save(); g.globalAlpha=fade;
  const tone=toneSolid(inkLevel(6));
  const shY=headCy+headR*1.4, hipY=dy-hH*0.42, shW=hH*0.30, hipW=hH*0.22;
  // long robe/torso (a staffed traveller, Mentor)
  pen.paint(()=>{
    g.moveTo(dx-shW*0.5, shY);
    g.lineTo(dx+shW*0.5, shY);
    g.lineTo(dx+hipW*0.62, dy);
    g.lineTo(dx-hipW*0.62, dy);
    g.closePath();
  }, tone, 4);
  // raised near arm (mid-transform lift)
  pen.limb(()=>{ g.moveTo(dx+shW*0.40, shY+hH*0.02); g.lineTo(dx+shW*0.78, shY-hH*0.20); }, tone, hH*0.06);
  pen.limb(()=>{ g.moveTo(dx-shW*0.40, shY+hH*0.02); g.lineTo(dx-shW*0.62, shY+hH*0.14); }, tone, hH*0.06);
  // staff
  pen.ink(()=>{ g.moveTo(dx-shW*0.66, shY-hH*0.10); g.lineTo(dx-shW*0.72, dy); }, 3);
  // neck + head
  pen.limb(()=>{ g.moveTo(dx,shY); g.lineTo(dx,headCy+headR*0.6); }, tone, hH*0.05);
  pen.paint(()=>{ g.arc(dx, headCy, headR, 0, TAU); }, tone, 4);
  g.restore();
  return crownY;
}

/* ---- the WAKE: streaks streaming behind the crossing eagle, back down the arc
   toward the departure spot. Reads as the disturbed-air trail of its passage. ---- */
function drawWake(pen,g,W,H,te,inten){
  const n=params.wakeStreaks;
  const t0=Math.max(0, te-0.34);
  g.save(); g.lineCap="round";
  for(let i=0;i<n;i++){
    const f=n>1 ? (i/(n-1))*2-1 : 0;               // -1..1 across the wake width
    const edge=1-Math.abs(f)*0.5;
    const p0=bez(W,H,t0), pm=bez(W,H,(t0+te)/2), p1=bez(W,H,te);
    // perpendicular spread of each streak
    const ang=bezTan(W,H,(t0+te)/2), nx=-Math.sin(ang), ny=Math.cos(ang);
    const spread=f*H*0.055;
    g.strokeStyle=inkLevel(2+Math.round(edge*2));
    g.lineWidth=1.3+edge*1.7;
    g.setLineDash([H*0.028, H*0.024]);
    g.lineDashOffset=(te*H*1.3 + i*11);            // dashes stream toward the bird
    g.globalAlpha=(0.42+0.32*edge)*inten*clamp01(te*1.6);
    g.beginPath();
    g.moveTo(p0.x+nx*spread*1.4, p0.y+ny*spread*1.4);
    g.quadraticCurveTo(pm.x+nx*spread, pm.y+ny*spread, p1.x+nx*spread*0.4, p1.y+ny*spread*0.4);
    g.stroke();
  }
  g.setLineDash([]); g.globalAlpha=1; g.restore();
}

/* ---- rising MOTES: the Mentor form dissolving upward into the eagle. Streams
   from the human's crown along the crossing arc to the bird. ---- */
function drawMotes(pen,g,W,H,cx0,cy0,bx,by,t,inten){
  const amt=clamp01(1-Math.abs(t-0.5)*1.6);
  if (amt<0.03) return;
  g.save(); g.fillStyle=inkLevel(5);
  const n=13;
  for(let i=0;i<n;i++){
    const seed=(i*37%13)/13;
    const along=((seed+t*0.9+i*0.06)%1);
    const x=lerp(cx0,bx,along)+Math.sin(seed*TAU+t*3)*W*0.05*(1-along);
    const y=lerp(cy0,by,along)-Math.abs(Math.sin(along*Math.PI))*H*0.05; // bow up along the arc
    const r=(1.3+3.0*(1-along))*amt*(0.6+0.4*inten);
    g.globalAlpha=(0.8*(1-along)+0.18)*amt;
    g.beginPath(); g.arc(x,y,r,0,TAU); g.fill();
  }
  g.globalAlpha=1; g.restore();
}

/* ---- the GREAT SEA-EAGLE: broad-winged raptor drawn in a canonical frame
   (head +X / travel direction), then rotated to the flight heading `dir`.
   `form` 0..1 morphs folded->fully-spread wings. Dark + crisp contour. ---- */
function drawEagle(pen,g,W,H,cx,cy,L,form,dir){
  const tone=toneSolid(inkLevel(7));
  const u=L, lw=Math.max(2, W*0.006);
  g.save(); g.translate(cx,cy); g.rotate(dir);

  // ---- WINGS (behind the body) : spread perpendicular to travel ----
  const wing=(s)=>{
    const span=(0.58+0.46*form)*u;                          // half-wingspan grows with form
    const frontRoot={x:0.24*u, y:s*0.05*u};
    const tip={x:-0.04*u, y:s*span};
    const trailRoot={x:-0.36*u, y:s*0.16*u};
    const ctrlLead={x:0.34*u, y:s*span*0.62};               // leading edge bulges forward
    const ctrlTrail={x:-0.26*u, y:s*span*0.66};             // trailing edge sweeps back
    pen.paint(()=>{
      g.moveTo(frontRoot.x, frontRoot.y);
      g.quadraticCurveTo(ctrlLead.x, ctrlLead.y, tip.x, tip.y);
      g.quadraticCurveTo(ctrlTrail.x, ctrlTrail.y, trailRoot.x, trailRoot.y);
      g.closePath();
    }, tone, lw);
    // splayed primary "fingers" near the tip — the mark of a great eagle
    g.strokeStyle=INK; g.lineWidth=Math.max(2,W*0.0055); g.lineCap="round";
    for(let k=0;k<5;k++){
      const a=0.60+k*0.085;
      const fx=lerp(frontRoot.x, tip.x, a);
      const fy=lerp(frontRoot.y, tip.y, a);
      g.beginPath(); g.moveTo(fx,fy);
      g.lineTo(fx-0.10*u, fy + s*0.02*u + s*0.05*u*k);
      g.stroke();
    }
  };
  wing(-1); wing(1);

  // ---- BODY (teardrop along travel axis, nose +X) ----
  pen.paint(()=>{
    g.moveTo(0.50*u, 0);
    g.quadraticCurveTo(0.30*u, -0.13*u, -0.08*u, -0.115*u);
    g.quadraticCurveTo(-0.42*u, -0.10*u, -0.54*u, -0.03*u);
    g.lineTo(-0.66*u, 0);                                   // tail centre notch
    g.lineTo(-0.54*u, 0.03*u);
    g.quadraticCurveTo(-0.42*u, 0.10*u, -0.08*u, 0.115*u);
    g.quadraticCurveTo(0.30*u, 0.13*u, 0.50*u, 0);
    g.closePath();
  }, tone, lw);
  // tail wedge seams
  pen.seam(()=>{ g.moveTo(-0.40*u,-0.05*u); g.lineTo(-0.66*u,0); g.moveTo(-0.40*u,0.05*u); g.lineTo(-0.66*u,0); }, 2);

  // ---- HEAD + hooked beak (points in the direction of flight) ----
  const hx=0.52*u, hr=0.11*u;
  pen.paint(()=>{ g.arc(hx, 0, hr, 0, TAU); }, tone, lw);
  pen.paint(()=>{                                           // hooked beak
    g.moveTo(hx+hr*0.35, -hr*0.42);
    g.lineTo(hx+hr*1.7, 0);
    g.lineTo(hx+hr*0.35, hr*0.42);
    g.closePath();
  }, tone, 2);
  // bright eye-mark (tonal contrast on the dark head)
  pen.fillPath(()=>{ g.arc(hx+hr*0.15, -hr*0.25, hr*0.22, 0, TAU); }, inkLevel(1));

  g.restore();
}

function drawFX(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const t=clamp01(st.t ?? 0.6);
  const inten=st.intensity ?? params.intensity;
  const span=st.wingSpan ?? params.wingSpan;
  const layers=st.layers || ["gathering","wake","mentor","motes","eagle"];
  const has=l=>layers.includes(l);

  const dx=W*params.departure.x, dy=H*params.departure.y;

  // crossing kinematics along the bezier arc
  const te=smooth(t);
  const b=bez(W,H,te);
  const dir=bezTan(W,H,te);
  const L=W*0.30*(0.78+0.30*te)*span;                        // grows as it climbs into the sky
  const form=clamp01(t*1.7);
  const mentorFade=clamp01(1-t*1.05);

  // the mentor's crown — where dissolving motes peel off toward the bird
  const crownY=drawMentor(pen,g,W,H,dx,dy,0) || dy-H*0.22;

  if (has("gathering")) drawGathering(pen,g,W,H,t);
  if (has("wake"))      drawWake(pen,g,W,H,te,inten);
  if (has("mentor"))    drawMentor(pen,g,W,H,dx,dy,mentorFade);
  if (has("motes"))     drawMotes(pen,g,W,H,dx,crownY,b.x,b.y,t,inten);
  if (has("eagle"))     drawEagle(pen,g,W,H,b.x,b.y,L,form,dir);

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.athena-to-sea-eagle-transformation",
  type:"DIVINE_FX",
  name:"Athena-to-sea-eagle transformation",
  statusWord:"CROSSING",
  scene:"OD-B03-S05",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["gathering","wake","mentor","motes","eagle"],
  // normalized 0..1 source/target/field/consequence/camera anchors
  anchors:{
    "source:mentor":{     x:0.26, y:0.82 },   // where the disguise stood (source)
    "target:apex":{       x:0.82, y:0.30 },   // far sky the eagle crosses to (target)
    "bird:crossing":{     x:0.56, y:0.40 },   // representative mid-crossing position
    "consequence:altar":{ x:0.50, y:0.84 },   // the sacrificial altar left below
    "field:wake":{        x:0.44, y:0.52 },   // mid-point of the trailing wake
    "camera:wide":{       x:0.50, y:0.50 },
  },
  // the crossing corridor the transformation travels through, + the shore band
  zones:{ crossing:{ x0:0.18, y0:0.22, x1:0.90, y1:0.80 },
          gathering:{ x0:0.06, y0:0.80, x1:0.94, y1:0.98 } },
  // DIVINE_FX transformation states: mentor -> resolving -> crossing, w/ duration
  states:{
    initial:"crossing",
    nodes:{
      // mentor: the disguise still stands on the shore, wings just beginning
      mentor:{    preview:{ t:0.08, intensity:0.9, status:"MENTOR",    progress:0.08 } },
      // resolving: mid-transform — eagle formed low and lifting, human in motes
      resolving:{ preview:{ t:0.42, intensity:1.0, status:"RESOLVING", progress:0.42 } },
      // crossing: the great sea-eagle high and spread, crossing above the altar
      crossing:{  preview:{ t:0.72, intensity:1.1, status:"CROSSING",  progress:0.72 } },
    },
    edges:[["mentor","resolving"],["resolving","crossing"]],
  },
  duration:5.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","wingSpan"],

  // neutral preview: the great sea-eagle well up the arc, wings spread, crossing
  // above the gathering with a wake behind it, the Mentor dissolving below.
  preview:()=>({ t:0.62, intensity:1.05, wingSpan:1.0, status:"CROSSING", progress:0.62,
                 layers:["gathering","wake","mentor","motes","eagle"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
