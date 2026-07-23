/* creature.eagle-with-goose — the raptor omen that crosses the assembly.
   CREATURE asset (OD-B04-S06). A single sea-eagle in powered flight CROSSING
   FROM THE RIGHT, a captured white domestic goose clenched in its talons below.
   Read as an OMEN: an articulated flight PATH (a dashed arc, arrow at the head)
   traces the bird's crossing so an augur can read its line across the sky.

   NOT a humanoid rig — fully custom bird geometry from engine primitives, drawn
   in LOCAL space facing LEFT (nose toward -x, the direction of crossing):
     · a teardrop body + wedge tail
     · two two-segment wings (shoulder -> wrist -> splayed primary "fingers")
     · a hooked-beak head that can turn
     · grasping legs whose talons wrap the prey
     · the goose held BELOW: a light-tone body (near-white, so it separates
       tonally from the near-black eagle), limp neck & head dangling, one wing
       splayed, legs trailing.

   The eagle fills near-black ink (level 7); the goose fills near-paper (level 2)
   with a hard contour — the captured-white read. Two performances (states):
     cross  — mid-crossing, wings spread, prey secure, the omen arc prominent
     clutch — the seize/downbeat, talons cinched, goose thrashing, arc short
   SOLID grays + hard contour ONLY; the engine POST pass supplies the halftone.
   Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  bodyLen:0.200,     // eagle body length as a fraction of W
  horizon:0.87,      // faint ground line under the omen (the assembly below)
  eagleTone:7,       // raptor ink level (near-black)
  gooseTone:2,       // captured goose ink level (near-paper: the "white" read)
  flapSpeed:2.0,     // wingbeat rate for the live flap channel
};

/* ---- omen sky the raptor crosses: light field, a faint horizon over the
   assembled crowd, drifting cloud steps, faint streaming air ---- */
function drawSky(pen,g,W,H,t){
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);
  g.fillStyle = inkLevel(2); g.fillRect(0,H*0.50,W,H*(params.horizon-0.50));
  // cloud steps drifting across the mid sky
  g.fillStyle = inkLevel(2);
  for(let i=0;i<4;i++){
    const cx = ((i*0.29 + t*0.02)%1.1-0.05)*W;
    const cy = H*(0.18+0.13*(i%2));
    g.beginPath(); g.ellipse(cx,cy,W*0.13,H*0.028,0,0,TAU); g.fill();
  }
  // faint streaming air (the wind the bird rides), swept leftward like its course
  g.strokeStyle = INK; g.lineWidth = 1.5; g.globalAlpha = 0.10; g.lineCap="round";
  for(let i=0;i<6;i++){
    const y = H*(0.12+i*0.10);
    g.beginPath(); g.moveTo(W*0.60, y); g.lineTo(W*0.30, y-H*0.015); g.stroke();
    g.beginPath(); g.moveTo(W*0.94, y+H*0.02); g.lineTo(W*0.70, y+H*0.005); g.stroke();
  }
  g.globalAlpha = 1;
  // horizon + assembled crowd as a low bumpy silhouette (context, not baked cast)
  const hy = H*params.horizon;
  g.fillStyle = inkLevel(3); g.fillRect(0,hy,W,H-hy);
  pen.ink(()=>{ g.moveTo(0,hy); g.lineTo(W,hy); }, 3);
  g.fillStyle = inkLevel(4);
  for(let x=W*0.05;x<W*0.95;x+=W*0.045){
    const r = W*0.016*(0.7+0.5*Math.abs(Math.sin(x)));
    g.beginPath(); g.arc(x, hy, r, Math.PI, TAU); g.fill();
  }
}

/* ---- the OMEN-READABLE flight PATH: a dashed arc entering from the upper
   right, arcing OVER the raptor, and running ahead down-left with an arrowhead
   at its head so the crossing direction (right -> left) is legible. `reach`
   0..1 pulls the arrow back toward the bird for the clutch. ---- */
function drawOmenArc(g,W,H,birdX,birdY,reach){
  const x0=W*0.97, y0=H*0.20;                        // entry, upper right
  const cx=birdX,  cy=H*0.11;                          // control high above the bird (taut crest)
  // head of the path runs AHEAD of the bird (down-left); reach<1 pulls it back
  const aheadX = W*0.24, aheadY = H*0.64;
  const x1 = lerp(birdX, aheadX, reach);
  const y1 = lerp(birdY-H*0.10, aheadY, reach);
  g.save();
  g.strokeStyle = INK; g.globalAlpha = 0.6;
  g.lineWidth = Math.max(3, W*0.007); g.lineCap="round";
  g.setLineDash([W*0.024, W*0.016]);
  g.beginPath(); g.moveTo(x0,y0); g.quadraticCurveTo(cx,cy,x1,y1); g.stroke();
  g.setLineDash([]);
  // arrowhead at the head of the path, pointing along the course
  const ang = Math.atan2(y1-cy, x1-cx);
  const ah = W*0.030;
  g.globalAlpha = 0.85; g.fillStyle = INK;
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x1 - Math.cos(ang-0.42)*ah, y1 - Math.sin(ang-0.42)*ah);
  g.lineTo(x1 - Math.cos(ang+0.42)*ah, y1 - Math.sin(ang+0.42)*ah);
  g.closePath(); g.fill();
  g.restore();
}

/* ---- the captured WHITE GOOSE, drawn in LOCAL eagle space around a grip point.
   Light fill + hard contour = the "white domestic bird" read against the black
   raptor. `thrash` 0..1 splays the wing & lifts the neck (the struggle). ---- */
function drawGoose(pen,g,bl,grip,thrash){
  const gt = toneSolid(inkLevel(params.gooseTone));
  const cw = Math.max(2.5, bl*0.05);
  const bx = grip.x + bl*0.12, by = grip.y + bl*0.50;   // goose body centre, below the talons
  const gbw = bl*0.46, gbh = bl*0.30;                    // plump body

  // one splayed wing (behind body), flung up as it struggles
  const wingLift = lerp(0.35, 0.95, thrash);
  pen.paint(()=>{
    g.moveTo(bx+gbw*0.1, by-gbh*0.3);
    g.quadraticCurveTo(bx+gbw*0.9, by-gbh*(0.6+wingLift), bx+gbw*1.5, by-gbh*(0.2+wingLift*0.7));
    g.quadraticCurveTo(bx+gbw*1.0, by+gbh*0.1, bx+gbw*0.2, by+gbh*0.2);
    g.closePath();
  }, gt, cw);

  // plump body
  pen.paint(()=>{ g.ellipse(bx, by, gbw, gbh, 0.15, 0, TAU); }, gt, cw);

  // long neck curving down & forward, ending in a small head + bill (dangling)
  const nEnd = { x: bx - gbw*1.05, y: by + lerp(gbh*1.7, gbh*0.6, thrash) };
  pen.limb(()=>{
    g.moveTo(bx-gbw*0.5, by+gbh*0.1);
    g.quadraticCurveTo(bx-gbw*1.2, by+gbh*(0.6+0.6*(1-thrash)), nEnd.x, nEnd.y);
  }, gt, bl*0.075);
  // small head + short bill
  pen.paint(()=>{ g.arc(nEnd.x, nEnd.y, bl*0.055, 0, TAU); }, gt, cw*0.9);
  pen.paint(()=>{
    g.moveTo(nEnd.x-bl*0.03, nEnd.y-bl*0.02);
    g.lineTo(nEnd.x-bl*0.11, nEnd.y+bl*0.005);
    g.lineTo(nEnd.x-bl*0.03, nEnd.y+bl*0.04);
    g.closePath();
  }, gt, 1.5);
  // eye dot (dark, on the light head)
  pen.fillPath(()=>{ g.arc(nEnd.x-bl*0.012, nEnd.y-bl*0.008, bl*0.012, 0, TAU); }, inkLevel(7));

  // two legs trailing back & down (kicking)
  g.strokeStyle = INK; g.lineWidth = Math.max(2, bl*0.03); g.lineCap="round";
  for(let s=-1;s<=1;s+=2){
    const lx = bx + gbw*(0.6+0.15*s), ly = by + gbh*0.55;
    const kick = lerp(0.2, 0.7, thrash);
    g.beginPath(); g.moveTo(lx, ly);
    g.lineTo(lx + bl*0.10, ly + bl*(0.22 - kick*0.12*s));
    g.stroke();
  }

  // a couple of feather seams on the body for read
  pen.seam(()=>{ g.moveTo(bx-gbw*0.3, by-gbh*0.1); g.quadraticCurveTo(bx+gbw*0.1, by+gbh*0.2, bx+gbw*0.6, by+gbh*0.05); }, 2);
}

/* ---- ONE eagle in LOCAL space, facing LEFT (nose toward -x = the crossing
   direction), holding the goose below its talons. Pose channels:
     spread 0..1  wing extension     flap -1..1  wingtip sweep
     grip   0..1  talon cinch         head -1..1  head turn (down at prey / ahead)
     thrash 0..1  the goose's struggle ---- */
function drawEagle(pen,g,W,P){
  const bl  = W*params.bodyLen;
  const bhw = bl*0.21;                 // body half-height
  const tone = toneSolid(inkLevel(params.eagleTone));
  const cw = Math.max(2.5, W*0.006);
  const spread = clamp01(P.spread ?? 1);
  const flap   = clamp(P.flap ?? 0.2, -1, 1);
  const grip   = clamp01(P.grip ?? 0.6);
  const head   = clamp(P.head ?? -0.4, -1, 1);
  const thrash = clamp01(P.thrash ?? 0.3);

  const spreadF = 0.55 + 0.45*spread;
  const inner   = bl*0.66*spreadF;     // shoulder -> wrist
  const outer   = bl*0.60*spreadF;     // wrist -> primary tip
  const sh      = { x: -bl*0.04, y: -bhw*0.15 };   // wing root at the shoulder

  /* ---- WINGS: two two-segment wings sweeping UP from the shoulder, one back
     (right, upper) and one forward (left, lower) for depth. Drawn behind body. */
  const wing = (dirx, upFrac, back)=>{
    // leading direction: up + outward (dirx sets forward/back lean)
    const lead = norm(dirx, -1.35);
    const wrist = { x: sh.x + lead.x*inner, y: sh.y + lead.y*inner*upFrac };
    const out  = norm(dirx*1.5, -0.9);
    const tip  = { x: wrist.x + out.x*outer, y: wrist.y + out.y*outer*upFrac };
    const flapY = flap*bl*0.16;        // live wingtip sweep
    tip.y += flapY;
    pen.paint(()=>{
      g.moveTo(sh.x - Math.sign(dirx)*bl*0.02, sh.y - bl*0.05);
      g.quadraticCurveTo((sh.x+wrist.x)/2 + dirx*bl*0.04, (sh.y+wrist.y)/2 - bl*0.06,
                         wrist.x, wrist.y);
      g.quadraticCurveTo(lerp(wrist.x,tip.x,0.5)+dirx*bl*0.02, lerp(wrist.y,tip.y,0.5)-bl*0.03,
                         tip.x, tip.y);                                   // leading -> tip
      g.quadraticCurveTo(tip.x - dirx*outer*0.10, tip.y + bl*0.20,
                         wrist.x + dirx*outer*0.05, wrist.y + bl*0.16);   // tip -> wrist (trailing)
      g.quadraticCurveTo(lerp(wrist.x,sh.x,0.5), lerp(wrist.y,sh.y,0.5)+bl*0.16,
                         sh.x, sh.y + bl*0.10);                            // wrist -> body
      g.closePath();
    }, tone, cw);
    // splayed primary "fingers" off the outer wing
    g.strokeStyle = INK; g.lineWidth = Math.max(2, W*0.0045); g.lineCap="round";
    for(let k=0;k<4;k++){
      const f0 = 0.50 + k*0.15;
      const fx = lerp(wrist.x, tip.x, f0), fy = lerp(wrist.y, tip.y, f0);
      g.beginPath(); g.moveTo(fx, fy);
      g.lineTo(fx + dirx*outer*0.14, fy + bl*0.13 + k*bl*0.02);
      g.stroke();
    }
    // inner covert seam
    pen.seam(()=>{ g.moveTo(sh.x, sh.y); g.lineTo(lerp(sh.x,wrist.x,0.7), lerp(sh.y,wrist.y,0.7)); }, 2);
  };
  wing( 1.0, 1.0, true);      // far wing: sweeps up-back (right)
  wing(-1.0, 0.92, false);    // near wing: sweeps up-forward (left)

  /* ---- LEGS + TALONS reaching DOWN from the belly to clench the prey ---- */
  const grabY = bhw*0.9 + bl*0.30;        // where the talons meet the goose top
  const leg = (side)=>{
    const hip  = { x: side*bhw*0.5, y: bhw*0.4 };
    const foot = { x: side*bhw*0.55*(1-grip*0.4), y: grabY };
    pen.limb(()=>{ g.moveTo(hip.x, hip.y); g.lineTo(foot.x, foot.y); }, tone, bl*0.07);
    // hooked claws cinching around the prey (curl inward with grip)
    g.strokeStyle = INK; g.lineWidth = Math.max(2, W*0.0055); g.lineCap="round";
    for(let c=-1;c<=1;c++){
      const cl = bl*0.14;
      const a = c*0.55 + side*0.2;
      const curl = 0.5 + 0.6*grip;
      g.beginPath();
      g.moveTo(foot.x, foot.y);
      g.quadraticCurveTo(foot.x + Math.sin(a)*cl, foot.y + cl*0.5,
                         foot.x + Math.sin(a)*cl*curl, foot.y + cl*curl);
      g.stroke();
    }
  };
  leg(-1); leg(1);

  // the captured goose hangs below, gripped between the talons
  drawGoose(pen, g, bl, { x:0, y:grabY }, thrash);

  /* ---- BODY (teardrop, nose LEFT) + wedge TAIL (trailing right) ---- */
  pen.paint(()=>{
    g.moveTo(-bl*0.60, -bhw*0.10);                                   // nose (left)
    g.quadraticCurveTo(-bl*0.28, -bhw*1.15, bl*0.06, -bhw*0.95);     // crown/back
    g.quadraticCurveTo( bl*0.42, -bhw*0.55, bl*0.60, -bhw*0.22);     // toward tail top
    g.lineTo(bl*0.54, 0);                                            // tail root notch
    g.quadraticCurveTo(bl*0.40, bhw*0.55, bl*0.02, bhw*0.98);        // belly
    g.quadraticCurveTo(-bl*0.30, bhw*1.05, -bl*0.60, -bhw*0.10);     // belly -> nose
    g.closePath();
  }, tone, cw);
  // wedge tail fanning off the back
  pen.paint(()=>{
    g.moveTo(bl*0.50, -bhw*0.35);
    g.lineTo(bl*0.98, -bhw*0.62);
    g.lineTo(bl*0.92, 0);
    g.lineTo(bl*0.98, bhw*0.55);
    g.lineTo(bl*0.50, bhw*0.30);
    g.closePath();
  }, tone, cw);
  pen.seam(()=>{ g.moveTo(bl*0.62, -bhw*0.2); g.lineTo(bl*0.94, -bhw*0.25); }, 2);
  pen.seam(()=>{ g.moveTo(bl*0.62, bhw*0.12); g.lineTo(bl*0.94, bhw*0.30); }, 2);

  /* ---- HEAD + hooked beak, thrust out LEFT on a short neck (turns with `head`) ---- */
  const hR  = bl*0.185;
  const hx  = -bl*0.72;
  const hy  = -bhw*0.35 + head*hR*0.4;
  // short neck bridging body -> head (so the head reads as a distinct mass)
  pen.limb(()=>{ g.moveTo(-bl*0.42, -bhw*0.25); g.lineTo(hx+hR*0.5, hy+hR*0.2); }, tone, bl*0.17);
  pen.paint(()=>{ g.arc(hx, hy, hR, 0, TAU); }, tone, cw);
  // long hooked beak pointing left-forward
  pen.paint(()=>{
    g.moveTo(hx - hR*0.60, hy - hR*0.38);
    g.lineTo(hx - hR*1.95, hy + head*hR*0.25 - hR*0.05);
    g.quadraticCurveTo(hx - hR*1.7, hy + hR*0.55, hx - hR*1.35, hy + hR*0.35);  // hook tip
    g.lineTo(hx - hR*0.5,  hy + hR*0.5);
    g.quadraticCurveTo(hx - hR*0.2, hy + hR*0.12, hx - hR*0.60, hy - hR*0.38);
    g.closePath();
  }, tone, 2);
  // fierce eye: bright ring + dark pupil (tonal contrast on the black head)
  pen.fillPath(()=>{ g.arc(hx + hR*0.02, hy - hR*0.15, hR*0.30, 0, TAU); }, inkLevel(1));
  pen.fillPath(()=>{ g.arc(hx - hR*0.02, hy - hR*0.15, hR*0.14, 0, TAU); }, inkLevel(7));
}

/* small vector normalize helper */
function norm(x,y){ const n=Math.hypot(x,y)||1; return { x:x/n, y:y/n }; }

/* ---- per-state flight pose + placement (fraction of W/H) ---- */
function poseFor(pose, t){
  const beat = Math.sin(t*params.flapSpeed);
  const P = {
    cross:{
      x:0.56, y:0.44, s:1.0, bank:0.10,
      spread:1.0, flap:0.15+beat*0.30, grip:0.7, head:-0.35, thrash:0.25, arc:1.0,
    },
    clutch:{
      x:0.52, y:0.48, s:1.04, bank:0.24,
      spread:0.82, flap:0.65+beat*0.15, grip:1.0, head:0.6, thrash:0.85, arc:0.45,
    },
  };
  return P[pose] || P.cross;
}

function drawCreature(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const pose = st.pose || "cross";
  const t = st.t || 0;
  const layers = st.layers || ["sky","arc","eagle"];
  const has = l => layers.includes(l);
  const P = poseFor(pose, t);
  const bob = Math.sin(t*1.3)*H*0.006;
  const bx = P.x*W, by = P.y*H + bob;

  if (has("sky")) drawSky(pen,g,W,H,t);
  if (has("arc")) drawOmenArc(g,W,H,bx,by,P.arc);
  if (has("eagle")){
    g.save();
    g.translate(bx, by);
    g.rotate(P.bank);
    g.scale(P.s, P.s);
    drawEagle(pen, g, W, P);
    g.restore();
  }
  return { anchors: asset.anchors };
}

export const asset = {
  id:"creature.eagle-with-goose",
  type:"CREATURE",
  name:"Eagle with goose",
  statusWord:"OMEN",
  scene:"OD-B04-S06",

  params,
  // back -> front draw order the creature honors; scene state can pass a subset
  layers:["sky","arc","eagle"],
  // normalized 0..1 attention / body / contact / camera anchors (neutral CROSS pose)
  anchors:{
    "eagle:body":{ x:0.56, y:0.44 },
    "eagle:head":{ x:0.48, y:0.42 },     // the hooked head, leading the crossing (left)
    "eagle:tail":{ x:0.66, y:0.44 },
    "eagle:talons":{ x:0.56, y:0.52 },   // grip point on the prey
    "goose:body":{ x:0.57, y:0.57 },     // the captured white bird, held below
    "goose:head":{ x:0.51, y:0.62 },     // its dangling head
    "path:entry":{ x:0.96, y:0.14 },     // omen arc enters upper-right
    "path:head":{ x:0.68, y:0.30 },      // arrow head of the flight path
    "omen:target":{ x:0.30, y:0.86 },    // the augur / assembly the sign crosses toward
    "camera:cross":{ x:0.52, y:0.44 },
  },
  // collision proxy for the flying pair (normalized)
  collision:{
    eagle:{ shape:"ellipse", cx:0.56, cy:0.44, rx:0.26, ry:0.16 },
    goose:{ shape:"ellipse", cx:0.57, cy:0.57, rx:0.09, ry:0.07 },
  },
  // two performances the scene can drive
  states:{
    initial:"cross",
    nodes:{
      cross:{  preview:{ pose:"cross",  status:"CROSSING", progress:0.35 } },
      clutch:{ preview:{ pose:"clutch", status:"CLUTCH",   progress:0.70 } },
    },
    edges:[["clutch","cross"],["cross","clutch"]],
  },
  duration:5.0,
  // flight-pose channels the runtime can drive over the scene clock
  channels:["t","pose","spread","flap","grip","head","thrash","bank"],

  // neutral preview: the raptor mid-CROSSING from the right, white goose clutched
  // below, the dashed omen arc sweeping in — reads as "eagle with goose".
  preview:()=>({ pose:"cross", t:0.5, status:"OMEN", progress:0.35,
                 layers:["sky","arc","eagle"] }),
  draw(ctx,W,H,state){ return drawCreature(ctx,W,H,state||{}); },
};
export default asset;
