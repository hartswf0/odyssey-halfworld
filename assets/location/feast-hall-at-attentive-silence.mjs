/* location.feast-hall-at-attentive-silence — a palace feast hall the instant
   the music stops and every gaze turns to the storyteller.
   LOCATION asset (empty navigable set — NO baked characters). Built in SOLID
   grays + hard contour into the offscreen ctx; the engine dotify pass supplies
   the halftone. Declares fg/mid/bg depth, walkable zone, seat anchors, a bard's
   (now-silent) seat, a central narrative guest-seat, converged gaze-lines and a
   focus point, plus placement + camera anchors and alternate states.
   Atlas: OD-B08-S05 — same palace hall with music stopped, all gazes converged,
   narrative-seat focus. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  floorLevel:0.66,      // horizon / floor line as fraction of H
  columns:4,            // hall columns receding down each side
  benches:3,            // banqueters' benches receding along each wall
  bardSeat:true,        // the bard's seat (left), lyre set aside — music stopped
  narrativeSeat:true,   // the central raised guest-seat the story is told from
  frieze:true,
};

/* seat/diner positions around the hall that the gaze-lines fan in from.
   Normalized to the drawing box; converted to px in drawSet. */
function gazeOrigins(){
  const pts=[];
  const n=params.benches;
  for(const sgn of [-1,1]){
    for(let i=0;i<n;i++){
      const depth=i/(n-1);
      pts.push({ x:0.5 + sgn*(0.30 - depth*0.09), y:0.66 + 0.055 - depth*0.075 });
    }
  }
  // near foreground diners at the banquet tables
  pts.push({ x:0.30, y:0.90 }, { x:0.70, y:0.90 });
  pts.push({ x:0.22, y:0.82 }, { x:0.78, y:0.82 });
  pts.push({ x:0.40, y:0.94 }, { x:0.60, y:0.94 });
  // the bard, turned from his seat toward the tale
  pts.push({ x:0.155, y:0.60 });
  return pts;
}

/* draw a subset of layers so scene state can reveal/occlude depth + focus */
function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.floorLevel;
  const T = st.t || 0;
  // converge: 0 = scattered attention, 1 = every gaze locked on the narrator
  const converge = st.converge != null ? st.converge : 1;
  // hush: 0 = lively feast, 1 = fully hushed (dims the room, lifts the focus)
  const hush = st.hush != null ? st.hush : 1;
  const layers = st.layers || ["backwall","frieze","sidewalls","columns","floor",
    "bardseat","narrativeseat","tables","gazelines","focus","anchors"];
  const has = l => layers.includes(l);
  const cx = W*0.5;

  // the focus point — head-height above the narrative seat
  const fx = cx, fy = horizon - H*0.20;

  // ---- BACK WALL (mid tone; darkens a touch as the room hushes) ----
  if (has("backwall")){
    const wallTone = Math.round(lerp(3.0, 3.6, clamp(hush,0,1)));
    pen.paint(()=>{ g.rect(W*0.05, H*0.12, W*0.90, horizon-H*0.12); }, toneSolid(inkLevel(wallTone)), 5);
    // shallow niche behind the narrator, brighter — the eye is led here
    pen.paint(()=>{ g.rect(cx-W*0.14, horizon-H*0.36, W*0.28, H*0.36); }, toneSolid(inkLevel(2)), 4);
    pen.ink(()=>{ g.moveTo(cx-W*0.14, horizon-H*0.36); g.lineTo(cx-W*0.14, horizon); }, 2);
    pen.ink(()=>{ g.moveTo(cx+W*0.14, horizon-H*0.36); g.lineTo(cx+W*0.14, horizon); }, 2);
  }

  // ---- FRIEZE / cornice band along the top of the back wall ----
  if (has("frieze") && params.frieze){
    pen.paint(()=>{ g.rect(W*0.03, H*0.07, W*0.94, H*0.05); }, toneSolid(inkLevel(5)), 5);
    for(let i=0;i<28;i++){ const dx=W*0.05 + (W*0.90)*(i/27);
      pen.ink(()=>{ g.moveTo(dx, H*0.083); g.lineTo(dx, H*0.107); }, 2); }
    pen.ink(()=>{ g.moveTo(W*0.03, H*0.122); g.lineTo(W*0.97, H*0.122); }, 3);
  }

  // ---- SIDE WALLS framing hall depth ----
  if (has("sidewalls")){
    pen.paint(()=>{ g.moveTo(0,H*0.07); g.lineTo(W*0.05,H*0.12); g.lineTo(W*0.05,horizon); g.lineTo(0,horizon+H*0.07); g.closePath(); }, toneSolid(inkLevel(4)), 4);
    pen.paint(()=>{ g.moveTo(W,H*0.07); g.lineTo(W*0.95,H*0.12); g.lineTo(W*0.95,horizon); g.lineTo(W,horizon+H*0.07); g.closePath(); }, toneSolid(inkLevel(4)), 4);
  }

  // ---- COLUMNS receding down each side of the hall ----
  if (has("columns") && params.columns){
    const n=params.columns;
    for(const sgn of [-1,1]){
      for(let i=0;i<n;i++){
        const depth=i/(n-1);                              // 0 near .. 1 far
        const cxp = cx + sgn*(W*0.42 - depth*W*0.24);
        const ch  = H*0.34*(1-depth*0.42), cw = W*0.045*(1-depth*0.40);
        const cy  = horizon - depth*H*0.02;
        pen.paint(()=>{ g.rect(cxp-cw/2, cy-ch, cw, ch); }, toneSolid(inkLevel(4)), 4);   // shaft
        pen.paint(()=>{ g.rect(cxp-cw*0.85, cy-ch, cw*1.7, ch*0.07); }, toneSolid(inkLevel(5)), 3); // capital
        pen.paint(()=>{ g.rect(cxp-cw*0.85, cy-ch*0.05, cw*1.7, ch*0.05); }, toneSolid(inkLevel(5)), 3); // base
      }
    }
  }

  // ---- FLOOR (foreground, light so it reads as polished ground) ----
  if (has("floor")){
    g.fillStyle=inkLevel(2); g.fillRect(0,horizon,W,H-horizon);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.28;
    for(let i=-6;i<=6;i++){ g.beginPath(); g.moveTo(cx, horizon); g.lineTo(cx+i*W*0.15, H); g.stroke(); }
    for(let j=1;j<=3;j++){ const y=horizon+(H-horizon)*(j/3)*(j/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- BARD'S SEAT (left) — chair with the lyre set aside; the music stopped
  if (has("bardseat") && params.bardSeat){
    const bx = W*0.155, by = horizon + H*0.03;
    const bw = W*0.075, bh = H*0.14;
    // seat back
    pen.paint(()=>{ g.rect(bx-bw/2, by-bh, bw, bh*0.72); }, toneSolid(inkLevel(4)), 4);
    // seat block (empty)
    pen.paint(()=>{ g.rect(bx-bw*0.62, by-bh*0.16, bw*1.24, bh*0.30); }, toneSolid(inkLevel(3)), 4);
    // legs
    pen.paint(()=>{ g.rect(bx-bw*0.5, by+bh*0.12, bw*0.14, bh*0.24); }, toneSolid(inkLevel(5)), 3);
    pen.paint(()=>{ g.rect(bx+bw*0.36, by+bh*0.12, bw*0.14, bh*0.24); }, toneSolid(inkLevel(5)), 3);
    // the lyre — leaned against the seat, silent. Wide rounded soundbox with
    // two curved horns and a yoke, so it reads as an instrument (not a figure).
    const lx = bx + bw*0.92, ly = by + bh*0.06, lw = W*0.065, lh = H*0.095;
    // rounded tortoise-shell soundbox at the base
    pen.paint(()=>{ g.ellipse(lx, ly, lw*0.55, lh*0.30, 0, 0, 7); }, toneSolid(inkLevel(4)), 4);
    // two curving horn-arms rising from the box
    for(const hs of [-1,1]){
      pen.limb(()=>{
        g.moveTo(lx+hs*lw*0.30, ly-lh*0.10);
        g.quadraticCurveTo(lx+hs*lw*0.62, ly-lh*0.7, lx+hs*lw*0.30, ly-lh);
      }, toneSolid(inkLevel(2)), 5);
    }
    // yoke crossbar joining the horns + still strings hanging down
    pen.ink(()=>{ g.moveTo(lx-lw*0.30, ly-lh); g.lineTo(lx+lw*0.30, ly-lh); }, 4);
    for(let s=-2;s<=2;s++){ pen.ink(()=>{ g.moveTo(lx+s*lw*0.12, ly-lh*0.96); g.lineTo(lx+s*lw*0.08, ly-lh*0.14); }, 1); }
  }

  // ---- NARRATIVE GUEST-SEAT — central, raised on a low dais, brightly lit ----
  if (has("narrativeseat") && params.narrativeSeat){
    const sw=W*0.13, sh=H*0.20;
    const sx=cx, sy=horizon + H*0.02;
    // dais step under the seat (reads as an elevated place)
    pen.paint(()=>{ g.rect(sx-sw*0.95, sy+H*0.005, sw*1.9, H*0.045); }, toneSolid(inkLevel(4)), 4);
    pen.paint(()=>{ g.rect(sx-sw*0.75, sy-H*0.03, sw*1.5, H*0.045); }, toneSolid(inkLevel(3)), 4);
    // tall seat back (lighter than the room — spotlit)
    const backTone = Math.round(lerp(4.0, 3.0, clamp(hush,0,1)));
    pen.paint(()=>{ g.rect(sx-sw/2, sy-sh, sw, sh*0.80); }, toneSolid(inkLevel(backTone)), 5);
    // crest atop the back
    pen.paint(()=>{ g.moveTo(sx-sw*0.5, sy-sh); g.lineTo(sx, sy-sh-H*0.035); g.lineTo(sx+sw*0.5, sy-sh); g.closePath(); }, toneSolid(inkLevel(5)), 4);
    // bright inlay up the back
    pen.paint(()=>{ g.rect(sx-sw*0.11, sy-sh+H*0.015, sw*0.22, sh*0.52); }, toneSolid(inkLevel(1)), 3);
    // seat cushion (empty — a place, not a person)
    pen.paint(()=>{ g.rect(sx-sw*0.56, sy-sh*0.12, sw*1.12, sh*0.30); }, toneSolid(inkLevel(2)), 5);
    // arms
    pen.paint(()=>{ g.rect(sx-sw*0.56, sy-sh*0.20, sw*0.15, sh*0.46); }, toneSolid(inkLevel(5)), 4);
    pen.paint(()=>{ g.rect(sx+sw*0.41, sy-sh*0.20, sw*0.15, sh*0.46); }, toneSolid(inkLevel(5)), 4);
  }

  // ---- BANQUET TABLES (foreground) flanking a central aisle, music stopped ----
  if (has("tables")){
    for(const sgn of [-1,1]){
      // table top — trapezoid, widening toward the viewer (perspective)
      const nearX = cx + sgn*W*0.30, nearY = H*0.985;
      const farX  = cx + sgn*W*0.135, farY = horizon + H*0.055;
      pen.paint(()=>{
        g.moveTo(farX - W*0.05, farY);
        g.lineTo(farX + W*0.07, farY);
        g.lineTo(nearX + W*0.10, nearY);
        g.lineTo(nearX - W*0.13, nearY);
        g.closePath();
      }, toneSolid(inkLevel(3)), 5);
      // dark front edge of the table
      pen.ink(()=>{ g.moveTo(nearX - W*0.13, nearY); g.lineTo(nearX + W*0.10, nearY); }, 3);
      // set-down cups / dishes left untouched on the table (the feast paused)
      for(let k=0;k<3;k++){
        const p=(k+1)/4;
        const dx=lerp(farX, nearX, p), dy=lerp(farY, nearY, p);
        pen.paint(()=>{ g.ellipse(dx, dy, W*0.017*(0.6+0.6*p), W*0.008*(0.6+0.6*p), 0,0,7); }, toneSolid(inkLevel(5)), 2);
      }
    }
  }

  // ---- GAZE-LINES — every attention fans in on the narrator's focus point ----
  if (has("gazelines")){
    const origins = gazeOrigins();
    g.save();
    g.lineCap="round";
    for(const o of origins){
      const ox=o.x*W, oy=o.y*H;
      // partial-draw toward the focus by `converge` (scattered -> locked)
      const tx = lerp(ox, fx, 0.12 + 0.76*clamp(converge,0,1));
      const ty = lerp(oy, fy, 0.12 + 0.76*clamp(converge,0,1));
      g.globalAlpha = 0.18 + 0.30*clamp(converge,0,1);
      g.strokeStyle=INK; g.lineWidth=2.2;
      g.beginPath(); g.moveTo(ox,oy); g.lineTo(tx,ty); g.stroke();
      // small tick at the origin (a turned head / lifted eye)
      g.globalAlpha=0.5; g.lineWidth=3;
      g.beginPath(); g.arc(ox,oy,3,0,7); g.stroke();
    }
    g.restore();
  }

  // ---- FOCUS POINT — the hushed centre of attention above the seat ----
  if (has("focus")){
    g.save();
    // concentric rings, brighter/tighter as the hush deepens. Drawn solid
    // (no alpha) so they hold up over the bright niche behind the narrator.
    const rings=3;
    for(let i=rings-1;i>=0;i--){
      const rr = W*0.028 + i*W*0.030 + Math.sin(T*1.4+i)*W*0.004;
      g.strokeStyle=INK; g.lineWidth=Math.max(2, 4.2 - i*1.0);
      g.beginPath(); g.arc(fx, fy, rr, 0, 7); g.stroke();
    }
    // solid focus mark at the exact narrative point
    g.fillStyle=inkLevel(7);
    g.beginPath(); g.arc(fx, fy, W*0.016, 0, 7); g.fill();
    g.restore();
  }
}

export const asset = {
  id:"location.feast-hall-at-attentive-silence",
  type:"LOCATION",
  name:"Feast Hall at Attentive Silence",
  statusWord:"HUSHED",
  scene:"OD-B08-S05",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["backwall","frieze","sidewalls","columns","floor","bardseat","narrativeseat","tables","gazelines","focus","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "seat:narrator":{x:.50,y:.66}, "focus:tale":{x:.50,y:.46},
    "seat:bard":{x:.155,y:.66}, "prop:lyre-rest":{x:.20,y:.62},
    "table:left":{x:.30,y:.86}, "table:right":{x:.70,y:.86},
    "bench:left":{x:.20,y:.70}, "bench:right":{x:.80,y:.70},
    "bench:left-far":{x:.30,y:.62}, "bench:right-far":{x:.70,y:.62},
    "aisle:center":{x:.50,y:.90}, "threshold:back":{x:.50,y:.50},
    "entrance:right":{x:.94,y:.80}, "exit:right":{x:.94,y:.80},
    "camera:wide":{x:.50,y:.50}, "camera:narrator":{x:.50,y:.58}, "camera:focus":{x:.50,y:.48},
  },
  // walkable ground region (for scene placement / pathing) + sub-zones
  zones:{
    walkable:{ x0:.08,y0:.66,x1:.92,y1:.98 },
    "center-aisle":{ x0:.42,y0:.66,x1:.58,y1:.98 },
    "narrator-dais":{ x0:.40,y0:.62,x1:.60,y1:.72 },
    "tables-fg":{ x0:.10,y0:.72,x1:.90,y1:.99 },
  },
  states:{
    initial:"attentive-silence",
    nodes:{
      // OD-B08-S05: music stopped, all gazes converged, narrative-seat focus
      "attentive-silence":{ preview:{ layers:["backwall","frieze","sidewalls","columns","floor","bardseat","narrativeseat","tables","gazelines","focus"], converge:1, hush:1 } },
      // the feast still lively, attention scattered, no single focus yet
      "feasting":{ preview:{ layers:["backwall","frieze","sidewalls","columns","floor","bardseat","narrativeseat","tables","gazelines"], converge:0.15, hush:0.15 } },
      // the room emptied — just the set, the seats, the silent lyre
      "empty":{ preview:{ layers:["backwall","frieze","sidewalls","columns","floor","bardseat","narrativeseat","tables"], converge:0, hush:0.5 } },
    },
    edges:[["feasting","attentive-silence"],["attentive-silence","feasting"],["attentive-silence","empty"]],
  },
  channels:["converge","hush","reveal","camera","light","t"],

  preview:()=>({ layers:["backwall","frieze","sidewalls","columns","floor","bardseat","narrativeseat","tables","gazelines","focus"], converge:1, hush:1, t:0.4, status:"HUSHED", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
